import { ChatOpenAI } from '@langchain/openai';
import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import { HumanMessage, AiMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate } from '@langchain/core/prompts';

import AWS from 'aws-sdk';
// import { openAIResponseStream } from 'gadget-server/ai';

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
  let str = JSON.stringify(obj, function (_key, value) {
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

const getBaseSystemPrompt = (products) => {
  return (
    `You are a helpful shopping assistant trying to match customers with the ` +
    `right product. Always try to give users product recommendations, even ` +
    `when they ask questions out of scope such as "I want to look like a ` +
    `celebrity from ...". You will be given a question from a customer and ` +
    `some JSON objects with the id, title, handle, and description (body) ` +
    `of products available for sale that roughly match the customer's ` +
    `question, as well as the store domain. Respond in HTML markup, with an ` +
    `anchor tag at the end with images that link to the product pages and ` +
    `<br /> tags between your text response and product recommendations. ` +
    `The anchor should be of the format: <a href="https://[domain]/products/[handle]" target="_blank">[title]<img src=[product.images.edges[0].node.source] /></a> ` +
    `but with the domain, handle, and title replaced with passed-in ` +
    `variables. If you have recommended products, end your response with ` +
    `"Click on a product to learn more!" If you are unsure or if the ` +
    `question seems unrelated to shopping, say "Sorry, I don't know how to ` +
    `help with that", and include some suggestions for better questions to ` +
    `ask. Please do respond to normal greeting questions like "Hi", and if ` +
    `the user inputs their needs, please suggest products to match their ` +
    `needs always. Here are the json products you can use to generate a ` +
    `response: ${stringify(products)}`
  );
};

const handleLLMOnComplete = (products, content) => {
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
  let chatHistory = [];

  const model = new ChatOpenAI({
    openAIApiKey: connections.openai.configuration.apiKey,
    modelName: 'gpt-4-turbo-preview',
    streaming: true,
  });

  // RAG variables
  /**@type { number[] } */
  let embedding = [];

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

  if (payload.chatHistory && Array.isArray(payload.chatHistory)) {
    Array.from(payload.chatHistory).forEach((value) => {
      chatHistory.push(
        value.role === 'system' ? new AiMessage(value.content) : new HumanMessage(value.content)
      );
    });
  }

  // Assuming further processing is done only if an image is uploaded
  if (imageUrl) {
    // If an image is uploaded, only consider the image as RAG retrieval.
    embedding = [
      ...embedding,
      ...(await createProductImageEmbedding({
        record: { source: imageUrl },
        api,
        logger,
        connections,
      })),
    ];
  } else {
    // If it is just chat, summarise the conversation into one retrieval qn.
    const summarisationChain = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder('messages'),
      [
        'user',
        'Given the above conversation, generate a search query to look up in ' +
        'order to get information relevant to the conversation. Only respond ' +
        'with the query, nothing else.',
      ],
    ])
      .pipe(model)
      .pipe(new StringOutputParser());

    const embeddingQuery =
      chatHistory.length > 0
        ? await summarisationChain.invoke({
          messages: [...chatHistory, new HumanMessage(userMessage)],
        })
        : userMessage;

    // TODO: migrate to image embeddings endpoint since it uses OpenAI CLIP
    // embed the incoming message from the user
    /** @type { { data: { embedding: number[] }[] } } */
    const embeddingResponse = await connections.openai.embeddings.create({
      input: embeddingQuery,
      model: 'text-embedding-ada-002',
    });

    embedding = [...embedding, ...embeddingResponse.data[0].embedding];
  }

  // find similar product descriptions
  const products = await api.shopifyProduct.findMany({
    sort: {
      descriptionEmbedding: {
        cosineSimilarityTo: embedding,
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

  const systemPrompt = getBaseSystemPrompt(products);

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    new MessagesPlaceholder('messages'),
  ]);

  prompt.validateTemplate = false;

  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  const stream = chain.stream(
    {
      messages: [
        ...chatHistory, 
        new HumanMessage(userMessage)],
    },
    {
      callbacks: [
        BaseCallbackHandler.fromMethods({
          handleLLMEnd(output, _runId) {
            handleLLMOnComplete(products, output);
          },
        }),
      ],
    }
  );

  await reply.send(stream);
}
