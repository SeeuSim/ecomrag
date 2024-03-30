import AWS from 'aws-sdk';
import { logger } from 'gadget-server';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBED_QUEUE_URL, CAPTION_QUEUE_URL } = process.env;

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const SQS = new AWS.SQS();

/**
 *
 * @param {{ Id: string, Source: string}} payload
 * @param {{ Caption: boolean, Embed: boolean}} isCaptionEmbed
 * @param { string | number } shopId
 * @param { typeof logger } logger
 */
export function postProductImgEmbedCaption(payload, isCaptionEmbed, shopId, logger) {
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
  logger.info('ProductImg: ' + JSON.stringify(messagePayload));
  if (isCaptionEmbed.Caption) {
    logger.info('Sending ProductImg Caption');
    SQS.sendMessage(
      {
        QueueUrl: CAPTION_QUEUE_URL,
        MessageBody: 'CaptionImg',
        MessageAttributes: messagePayload,
        MessageGroupId: `${shopId}`,
      },
      (err, data) => {
        if (err) {
          console.error('Error pushing to ProductImg caption queue: ' + err.message);
        } else {
          console.log(`Queued caption job | shopifyProductImg | ${JSON.stringify(messagePayload)}`);
        }
      }
    );
  }
  if (isCaptionEmbed.Embed) {
    logger.info('Sending ProductImg Embed');
    SQS.sendMessage(
      {
        QueueUrl: EMBED_QUEUE_URL,
        MessageBody: 'EmbedImg',
        MessageAttributes: messagePayload,
        MessageGroupId: `${shopId}`,
      },
      (err, data) => {
        if (err) {
          console.error('Error pushing to ProductImg embed queue: ' + err.message);
        } else {
          console.log(`Queued embed job | shopifyProductImg | ${JSON.stringify(messagePayload)}`);
        }
      }
    );
  }
}
