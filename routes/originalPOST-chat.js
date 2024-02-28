import { RouteContext } from "gadget-server";
import { openAIResponseStream } from "gadget-server/ai";

/**
 * Route handler for POST chat
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  // get input from shopper
  const { message } = request.body;

  // embed the incoming message from the user
  const embeddingResponse = await connections.openai.embeddings.create({ input: message, model: "text-embedding-ada-002" });

  // find similar product descriptions
  const products = await api.shopifyProduct.findMany({
    sort: {
      descriptionEmbedding: {
        cosineSimilarityTo: embeddingResponse.data[0].embedding,
      },
    },
    first: 2,
    filter: {
      status: {
        equals: "active",
      },
    },
    select: {
      id: true,
      title: true,
      body: true,
      handle: true,
      shop: {
        domain: true,
      },
      images: {
        edges: {
          node: {
            source: true,
          },
        },
      },
    },
  });

  // capture products in Gadget's Logs
  logger.info({ products, message: request.body.message }, "found products most similar to user input");

  const prompt = `You are a helpful shopping assistant trying to match customers with the right product. You will be given a question from a customer and some JSON objects with the id, title, handle, and description (body) of products available for sale that roughly match the customer's question, as well as the store domain. Respond in HTML markup, with an anchor tag at the end with images that link to the product pages and <br /> tags between your text response and product recommendations. The anchor should be of the format: <a href={"https://" + {domain} + "/products/" + {handle}} target="_blank">{title}<img style={border: "1px black solid"} width="200px" src={product.images.edges[0].node.source} /></a> but with the domain, handle, and title replaced with passed-in variables. If you have recommended products, end your response with "Click on a product to learn more!" If you are unsure or if the question seems unrelated to shopping, say "Soorry, I don't know how to help with that", and include some suggestions for better questions to ask. Here are the json products you can use to generate a response: ${JSON.stringify(
    products
  )}`;

  // send prompt and similar products to OpenAI to generate a response
  // using GPT-4 Turbo model
  const chatResponse = await connections.openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      { role: "user", content: message },
    ],
    stream: true,
  });

  // function fired after the steam is finished
  const onComplete = (content) => {
    // store the response from OpenAI, and the products that were recommended
    const recommendedProducts = products.map((product) => ({
      create: {
        product: {
          _link: product.id,
        },
      },
    }));
    void api.chatLog.create({
      response: content,
      recommendedProducts,
    });
  };

  await reply.send(openAIResponseStream(chatResponse, { onComplete }));
}