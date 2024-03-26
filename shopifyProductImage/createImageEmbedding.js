import AWS from 'aws-sdk';
import fetch from 'node-fetch';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBEDDING_ENDPOINT, CAPTIONING_ENDPOINT } = process.env;

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

export async function downloadImage(s3Url, logger) {
  logger.info(`Download Image: ${s3Url}`);
  AWS.config.update({ logger });
  const objectUrl = new URL(s3Url);
  const { host, pathname } = new URL(objectUrl);

  // Expected: BUCKET.s3.amazonaws.com/KEY
  // -> BUCKET, '/KEY'
  const bucket = host.split('.')[0];
  const key = pathname.replace(/\//, ''); // Replace leading slash in pathname

  const s3 = new AWS.S3();

  const params = {
    Bucket: bucket,
    Key: decodeURIComponent(key),
  };

  try {
    const data = await s3.getObject(params).promise();

    // TODO: Add logging and contingencies for error handling

    return { content: data.Body, fileType: data.ContentType };
  } catch (error) {
    //console.log(`Failed to download image from S3: ${error.message}`);
    throw new Error(error);
  }
}

export const createProductImageEmbedding = async ({ record, api, logger }) => {
  const shop = await api.shopifyShop.findOne(record.shopId, { select: { Plan: true } });
  const productImageSyncLimit = shop.productImageSyncLimit;
  const plan = shop.Plan;
  const planFeatures = {
    free: { includeImages: false },
    growth: { includeImages: true },
    premium: { includeImages: true },
    enterprise: { includeImages: true },
  };

  if (!planFeatures[plan] || !shop) {
    logger.info('Shop and plan could not be found.');
  }

  if (!planFeatures[plan].includeImages) {
    logger.info(
      'Image syncing is not allowed for the current plan. Skipping image embedding creation.'
    );
    return;
  }

  if (shop.productImageSyncCount >= productImageSyncLimit) {
    logger.info(
      'Product image sync limit reached for the current plan. Skipping image embedding creation.'
    );
    return;
  }

  if ((planFeatures[plan].includeImages && !record.imageEmbedding) || record.changed('image')) {
    try {
      logger.info({ record: record }, 'this is the record object');
      const imageUrl = record.source;
      const { content: image, fileType } = await downloadImage(imageUrl, logger);

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

      logger.info('This is the image payload: ' + JSON.stringify(payload));

      if (!payload.Embedding || !Array.isArray(payload.Embedding)) {
        logger.error({
          error: `Expected a response with one key 'Embedding', received object with keys: ${Object.keys(payload)}`,
        });
        return;
      }

      const embedding = payload.Embedding;

      logger.info(`Got image embedding: ${embedding}`);

      // Only caption and upload if action is triggered by model.
      if (record.id) {
        const textResponse = await fetch(CAPTIONING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'image/jpeg', Accept: 'application/json' },
          body: image,
        });

        if (!textResponse.ok) {
          const error = await embedResponse.text();
          logger.error({ error, textResponse }, 'An error occurred fetching the text embedding.');
          return;
        }

        /**@type { { Caption: string; Length: number; } } */
        const textPayload = await textResponse.json();
        const caption = textPayload.Caption;
        logger.info(`Got caption: ${caption}`);

        await Promise.all([
          api.internal.shopifyProductImage.update(record.id, {
            shopifyProductImage: {
              imageDescriptionEmbedding: embedding,
              imageDescription: caption,
            },
          }),
          api.internal.shopifyShop.update(record.id, {
            shopifyShop: {
              productImageSyncCount: shop.productImageSyncCount + 1,
            },
          }),
        ]);
      }

      return embedding;
    } catch (error) {
      logger.error({ error }, 'error creating embedding');
    }
  } else {
    logger.info(
      'Image syncing is not allowed for the current plan. Skipping image embedding creation.'
    );
  }
};
