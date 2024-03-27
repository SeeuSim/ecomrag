import AWS from 'aws-sdk';
import fetch from 'node-fetch';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBEDDING_ENDPOINT } = process.env;

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

export async function downloadCDNImage(cdnUrl, logger) {
  const imageResponse = await fetch(cdnUrl);
  if (!imageResponse.ok) {
    return undefined;
  }
  const imageBuffer = await imageResponse.arrayBuffer();
  const image = Buffer.from(imageBuffer);
  const { pathname } = new URL(cdnUrl);
  const parts = pathname.split('.');
  const fileExt = parts[parts.length - 1];
  return { content: image, fileType: `image/${fileExt}` };
}

export async function downloadS3Image(s3Url, logger) {
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
    logger.error('Shop and plan could not be found.');
  }

  if (!planFeatures[plan].includeImages) {
    logger.error(
      'Image syncing is not allowed for the current plan. Skipping image embedding creation.'
    );
    return;
  }

  if (shop.productImageSyncCount >= productImageSyncLimit) {
    logger.error(
      'Product image sync limit reached for the current plan. Skipping image embedding creation.'
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
        // From product sync, get from Shopify CDN
        // const { content: cdnImage, fileType: cdnFileType } = await downloadCDNImage(
        //   imageUrl,
        //   logger
        // );
        // image = cdnImage;
        // fileType = cdnFileType;
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

      // Only caption and upload if action is triggered by model.
      if (record.id) {
        return;
        // const textResponse = await fetch(CAPTIONING_ENDPOINT, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'image/jpeg', Accept: 'application/json' },
        //   body: image,
        // });

        // if (!textResponse.ok) {
        //   const error = await embedResponse.text();
        //   logger.error({ error, textResponse }, 'An error occurred fetching the text embedding.');
        //   return;
        // }

        // /**@type { { Caption: string; Length: number; } } */
        // const textPayload = await textResponse.json();
        // const caption = textPayload.Caption;
        // logger.info(`Got caption: ${caption}`);

        // await Promise.all([
        //   api.internal.shopifyProductImage.update(record.id, {
        //     shopifyProductImage: {
        //       imageDescriptionEmbedding: embedding,
        //       imageDescription: caption,
        //     },
        //   }),
        //   api.internal.shopifyShop.update(record.shopId, {
        //     shopifyShop: {
        //       productImageSyncCount: shop.productImageSyncCount + 1,
        //     },
        //   }),
        // ]);
      }

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
