import AWS from 'aws-sdk';
import { openAIResponseStream } from 'gadget-server/ai';

import { createProductImageEmbedding } from '../shopifyProductImage/createImageEmbedding';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } = process.env;

const BUCKET_PATH = 'images/';

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const s3 = new AWS.S3();

function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

function getCurrentDateString() {
  return new Date(Date.now()).toISOString();
}

async function uploadImage(imageBase64, fileName, fileType) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${BUCKET_PATH}${getCurrentDateString()}_${fileName}`,
    Body: Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
    ContentEncoding: 'base64',
    ContentType: fileType,
  };
  const response = await s3.putObject(params).promise();
  return response.Location;
}

export default async function route({ request, reply, api, logger, connections }) {
  let payload = request.body;

  let userMessage;
  let imageUrl = null;

  logger.info(payload);
  if (payload.Message) {
    userMessage = payload.Message;
  }

  // Check if there is an image and upload it
  if (
    payload.Image &&
    payload.Image.FileContent &&
    payload.Image.FileName &&
    payload.Image.FileType
  ) {
    const imageBase64 = payload.Image.FileContent;
    const imageName = payload.Image.FileName;
    const imageType = payload.Image.FileType;
    imageUrl = await uploadImage(imageBase64, imageName, imageType, logger);
  }

  // Assuming further processing is done only if an image is uploaded
  if (imageUrl) {
    const imageEmbedding = await createProductImageEmbedding({
      record: { source: imageUrl },
      api,
      logger,
      connections,
    });

    const products = await api.shopifyProductImage.findMany({
      sort: {
        imageDescriptionEmbedding: {
          // Sort by the cosine similarity to the image embedding
          cosineSimilarityTo: imageEmbedding,
        },
      },
      first: 2,
      select: {
        id: true,
        product: {
          title: true,
          //status: 'active',
          body: true,
          handle: true,
          shop: {
            domain: true,
          },
        },
        source: true,
      },
    });

    // capture products in Gadget's Logs
    logger.info({ products, message: userMessage }, 'found products most similar to user input');

    const prompt =
      `You are a helpful shopping assistant trying to match customers with the ` +
      `right product. You will be given a question from a customer and some ` +
      `JSON objects with the id, title, handle, and description (body) of ` +
      `products available for sale that roughly match the customer's question, ` +
      `as well as the store domain. Respond in HTML markup, with an anchor tag at ` +
      `the end with images that link to the product pages and <br /> tags between ` +
      `your text response and product recommendations. The anchor should be of the ` +
      `format: <a href={"https://" + {domain} + "/products/" + {handle}} target="_blank">{title}<img src={product.images.edges[0].node.source} /></a> ` +
      `but with the domain, handle, and title replaced with passed-in variables. ` +
      `If you have recommended products, end your response with ` +
      `"Click on a product to learn more!" If you are unsure or if the ` +
      `question seems unrelated to shopping, say "Sorry, I don't know how to ` +
      `help with that", and include some suggestions for better questions to ` +
      `ask. Please do respond to normal greeting questions like "Hi", and if ` +
      `the user inputs their needs, please suggest products to match their ` +
      `needs always. Here are the json products you can use to generate a ` +
      `response: ${stringify(products)}`;

    // send prompt and similar products to OpenAI to generate a response
    const chatResponse = await connections.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        { role: 'user', content: userMessage },
      ],
      stream: true,
    });

    // function fired after the stream is finished
    const onComplete = (content) => {
      // store the response from OpenAI, and the products that were recommended
      const imageRecommendedProducts = products.map((product) => ({
        create: {
          product: {
            _link: product.id,
          },
        },
      }));
      void api.chatLog.create({
        response: content,
        imageRecommendedProducts,
      });
    };

    await reply.send(openAIResponseStream(chatResponse, { onComplete }));
  } else {
    // embed the incoming message from the user
    const embeddingResponse = await connections.openai.embeddings.create({
      input: userMessage,
      model: 'text-embedding-ada-002',
    });

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
          equals: 'active',
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
    logger.info({ products, message: userMessage }, 'found products most similar to user input');

    const prompt =
      `You are a helpful shopping assistant trying to match customers with the ` +
      `right product. Always try to give users product recommendations, even ` +
      `when they ask questions out of scope such as "I want to look like a ` +
      `celebrity from ...". You will be given a question from a customer and ` +
      `some JSON objects with the id, title, handle, and description (body) ` +
      `of products available for sale that roughly match the customer's ` +
      `question, as well as the store domain. Respond in HTML markup, with an ` +
      `anchor tag at the end with images that link to the product pages and ` +
      `<br /> tags between your text response and product recommendations. ` +
      `The anchor should be of the format: <a href={"https://" + {domain} + "/products/" + {handle}} target="_blank">{title}<img src={product.images.edges[0].node.source} /></a> ` +
      `but with the domain, handle, and title replaced with passed-in ` +
      `variables. If you have recommended products, end your response with ` +
      `"Click on a product to learn more!" If you are unsure or if the ` +
      `question seems unrelated to shopping, say "Sorry, I don't know how to ` +
      `help with that", and include some suggestions for better questions to ` +
      `ask. Please do respond to normal greeting questions like "Hi", and if ` +
      `the user inputs their needs, please suggest products to match their ` +
      `needs always. Here are the json products you can use to generate a ` +
      `response: ${stringify(products)}`;

    // send prompt and similar products to OpenAI to generate a response
    const chatResponse = await connections.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        { role: 'user', content: userMessage },
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
}

