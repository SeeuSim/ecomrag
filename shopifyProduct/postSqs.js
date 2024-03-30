import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { logger } from 'gadget-server';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBED_QUEUE_URL } = process.env;

const client = new SQSClient({
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: 'us-east-1',
});

/**
 *
 * @param {{ Id: string, Description: string}} payload
 * @param { string | number } shopId
 * @param { typeof logger } logger
 */
export async function postProductDescEmbedding(payload, shopId, logger) {
  const messagePayload = {
    Id: {
      DataType: 'String',
      StringValue: payload.Id,
    },
    Description: {
      DataType: 'String',
      StringValue: payload.Description.slice(0, 77), // CLIP has max length of 77 chars
    },
    Model: {
      DataType: 'String',
      StringValue: 'shopifyProduct',
    },
  };

  try {
    const _response = await client.send(
      new SendMessageCommand({
        QueueUrl: EMBED_QUEUE_URL,
        MessageBody: 'Embed',
        MessageAttributes: messagePayload,
      })
    );
    console.log(`Queued embed job | shopifyProduct | ${JSON.stringify(messagePayload)}`);
  } catch (error) {
    console.error('Error pushing to embed queue: ' + `${error}`);
  }
}
