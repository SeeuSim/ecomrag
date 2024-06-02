import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { logger as GadgetLogger } from 'gadget-server';
import fetch from 'node-fetch';
import { PLAN_LIMITS } from '../plan/utils';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBEDDING_ENDPOINT } = process.env;

const client = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: 'us-east-1',
});

/**@type { (s3Url: string, logger: typeof GadgetLogger) => { content: Buffer, fileType: string}} */
export async function downloadS3Image(s3Url, logger) {
  const objectUrl = new URL(s3Url);
  const { host, pathname } = new URL(objectUrl);

  // Expected: BUCKET.s3.amazonaws.com/KEY
  // -> BUCKET, '/KEY'
  const bucket = host.split('.')[0];
  const key = pathname.replace(/\//, ''); // Replace leading slash in pathname

  const params = {
    Bucket: bucket,
    Key: decodeURIComponent(key),
  };

  try {
    const response = await client.send(new GetObjectCommand(params));
    if (response.Body) {
      logger.info(response.Body, 'S3 Get Image');
      const content = await response.Body.transformToByteArray();
      const fileType = response.ContentType;
      return { content: Buffer.from(content), fileType };
    }
  } catch (error) {
    //console.log(`Failed to download image from S3: ${error.message}`);
    throw new Error(error);
  }
}

/**
 * Create Image Embeddings from Sagemaker Realtime/Serverless Embed endpoint.
 * Purely for live chat use.
 * For Product/Product Image Sync, use the SQS Queues for async processing instead.
 * @param { { record: import('@gadget-client/ecomrag').ShopifyProductImage, api: typeof import('gadget-server').api, logger: typeof import ('gadget-server').logger } } context
 * @returns { Promise<number[] | void> }
 */
export const createProductImageEmbedding = async ({ record, api, logger }) => {
  const plan = await api.plan.maybeFindFirst({
    filter: {
      shop: {
        equals: record.shopId,
      },
    },
  });

  const tier = plan?.tier;
  const planFeatures = {
    Free: { includeImages: false },
    Growth: { includeImages: true },
    Premium: { includeImages: true },
    Enterprise: { includeImages: true },
  };

  if (!planFeatures[tier] || !plan || !tier) {
    logger.error('Shop and plan could not be found.');
    return;
  }

  if (!planFeatures[tier]?.includeImages) {
    logger.error(
      'Image syncing is not allowed for the current plan. Skipping image embedding creation.'
    );
    return;
  }

  if ((planFeatures[plan].includeImages && !record.imageEmbedding) || record.changed('image')) {
    try {
      const imageUrl = record.source;

      let image = undefined;
      let fileType = undefined;
      if (!record.id) {
        // From chat embed, get from S3
        const { content: s3Image, fileType: s3FileType } = await downloadS3Image(imageUrl, logger);
        image = s3Image;
        fileType = s3FileType;
      } else {
        return;
      }

      //Fetching the vector embedding under ShopifyProductImage.imageDescriptionEmbedding
      const embedResponse = await fetch(EMBEDDING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': fileType, Accept: 'application/json' },
        body: image,
      });

      if (!embedResponse.ok) {
        const error = await embedResponse.text();
        logger.error(
          { error, response: embedResponse },
          'An error occurred fetching the image embedding.'
        );
        return;
      }

      /**@type { { Embedding: number[] } } */
      const payload = await embedResponse.json();

      if (!payload.Embedding || !Array.isArray(payload.Embedding)) {
        logger.error({
          error: `Expected a response with one key 'Embedding', received object with keys: ${Object.keys(payload)}`,
        });
        return;
      }

      const embedding = payload.Embedding;

      return embedding;
    } catch (error) {
      logger.error({ error }, 'error creating embedding');
    }
  } else {
    logger.error(
      'Image syncing is not allowed for the current plan. Skipping image embedding creation.'
    );
  }
};
