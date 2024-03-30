import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { logger } from 'gadget-server';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBED_TOPIC_ARN, CAPTION_TOPIC_ARN } = process.env;

const client = new SNSClient({
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: 'us-east-1',
});

/**
 *
 * @param {{ Id: string, Source: string}} payload
 * @param {{ Caption: boolean, Embed: boolean}} isCaptionEmbed
 * @param { string | number } shopId
 * @param { typeof logger } logger
 */
export async function postProductImgEmbedCaption(payload, isCaptionEmbed, shopId, logger) {
  const messagePayload = {
    Id: {
      DataType: 'String',
      StringValue: payload.Id,
    },
    Source: {
      DataType: 'String',
      StringValue: payload.Source,
    },
    Model: {
      DataType: 'String',
      StringValue: 'shopifyProductImage',
    },
  };

  if (isCaptionEmbed.Caption) {
    try {
      const _response = await client.send(
        new PublishCommand({
          TopicArn: CAPTION_TOPIC_ARN,
          Message: 'Caption',
          MessageAttributes: messagePayload,
        })
      );
      console.log(`Queued caption job | shopifyProductImage | ${JSON.stringify(messagePayload)}`);
    } catch (error) {
      console.error(`Error pushing to ProductImg Caption Queue | ${payload.Id} | ${error}`);
    }
  }
  if (isCaptionEmbed.Embed) {
    try {
      const _response = await client.send(
        new PublishCommand({
          TopicArn: EMBED_TOPIC_ARN,
          Message: 'Embed',
          MessageAttributes: messagePayload,
        })
      );
      console.log(`Queued embed job | shopifyProductImage | ${JSON.stringify(messagePayload)}`);
    } catch (error) {
      console.error(`Error pushing to ProductImg Embed Queue | ${payload.Id} | ${error}`);
    }
  }
}
