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
 * @param { typeof logger } logger
 */
export function postProductImgEmbedCaption(payload, isCaptionEmbed, logger) {
  const payload = {
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
      StringValue: 'shopifyProduct',
    },
  };
  if (isCaptionEmbed.Caption) {
    SQS.sendMessage(
      {
        QueueUrl: CAPTION_QUEUE_URL,
        MessageBody: 'CaptionImg',
        MessageAttributes: payload,
      },
      (err, data) => {
        if (err) {
          logger.error('Error pushing to embed queue: ' + err.message);
        } else {
          logger.info(data, 'Queued embed job');
        }
      }
    );
  }
  if (isCaptionEmbed.Embed) {
    SQS.sendMessage(
      {
        QueueUrl: EMBED_QUEUE_URL,
        MessageBody: 'EmbedImg',
        MessageAttributes: payload,
      },
      (err, data) => {
        if (err) {
          logger.error('Error pushing to embed queue: ' + err.message);
        } else {
          logger.info(data, 'Queued embed job');
        }
      }
    );
  }
}
