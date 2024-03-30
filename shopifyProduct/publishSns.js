import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { logger } from 'gadget-server';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBED_TOPIC_ARN } = process.env;

const client = new SNSClient({
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
      new PublishCommand({
        Message: 'Embed',
        MessageAttributes: messagePayload,
        TopicArn: EMBED_TOPIC_ARN,
      })
    );
    console.log(`Queued embed job | shopifyProduct | ${JSON.stringify(messagePayload)}`);
  } catch (error) {
    console.error('Error pushing to embed queue: ' + `${error}`);
  }
}
