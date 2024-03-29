import AWS from 'aws-sdk';
import { logger } from 'gadget-server';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBED_QUEUE_URL } = process.env;

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const SQS = new AWS.SQS();

/**
 *
 * @param {{ Id: string, Description: string}} payload
 * @param { typeof logger } logger
 */
export function postProductDescEmbedding(payload, logger) {
  const messagePayload = {
    Id: {
      DataType: 'String',
      StringValue: payload.Id,
    },
    Description: {
      DataType: 'String',
      StringValue: payload.Description,
    },
    Model: {
      DataType: 'String',
      StringValue: 'shopifyProduct',
    },
  };
  SQS.sendMessage(
    {
      QueueUrl: EMBED_QUEUE_URL,
      MessageBody: 'EmbedDesc',
      MessageAttributes: messagePayload,
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
