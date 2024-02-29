import AWS from 'aws-sdk';
import fetch from 'node-fetch';
import { logger } from 'gadget-server';

const { EMBEDDING_ENDPOINT, CAPTIONING_ENDPOINT } = process.env;

export async function downloadImage(s3Url) {
  const url = new URL(s3Url);
  const bucketName = url.hostname.split('.')[0];
  // Remove the leading slash to get the correct key
  const objectKey = url.pathname.substring(1);

  const s3 = new AWS.S3();

  const params = {
    Bucket: bucketName,
    Key: decodeURIComponent(objectKey),
  };

  try {
    const data = await s3.getObject(params).promise();
    //console.log("got the image from s3")
    return data.Body;
  } catch (error) {
    //console.log(`Failed to download image from S3: ${error.message}`);
    throw new Error(error);
  }
}

export const createProductImageEmbedding = async ({ record, api, logger, connections }) => {
  if (!record.imageEmbedding || record.changed('image')) {
    try {
      logger.info({ record: record }, 'this is the record object');
      const imageUrl = record.source;
      const imageBuffer = await downloadImage(imageUrl);

      //Fetching the vector embedding under ShopifyProductImage.imageDescriptionEmbedding
      const response = await fetch(EMBEDDING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg', Accept: 'application/json' },
        body: imageBuffer,
      });

      //Fetching the text caption under ShopifyProductImage.imageDescription
      const textResponse = await fetch(CAPTIONING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg', Accept: 'application/json' },
        body: imageBuffer,
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error({ error, response }, 'An error occurred fetching the image embedding.');
        return;
      }

      if (!textResponse.ok) {
        const error = await response.text();
        logger.error({ error, textResponse }, 'An error occurred fetching the text embedding.');
        return;
      }

      const payload = await response.json();
      const textPayload = await textResponse.json();
      logger('This is the image payload +' + payload);
      logger('This is the text payload +' + textPayload);

      if (!payload.Embedding || !Array.isArray(payload.Embedding)) {
        logger.error({
          error: `Expected a response with one key 'Embedding', received object with keys: ${Object.keys(payload)}`,
        });
        return;
      }

      const embedding = payload.Embedding;
      const caption = textPayload.Caption;
      logger('This is the image embedding +' + embedding);
      logger('This is the text caption +' + caption);

      logger.info({ id: record.id }, 'got image embedding');

      await api.internal.shopifyProductImage.update(record.id, {
        shopifyProductImage: {
          imageDescriptionEmbedding: embedding,
          imageDescription: caption,
        },
      });
    } catch (error) {
      logger.error({ error }, 'error creating embedding');
    }
  }
};

// export default createProductImageEmbedding;

// module.exports = {
//   run: createProductImageEmbedding,
//   timeoutMS: 900000,
// };

// //Required export in Gadget syntax
// module.exports = createProductImageEmbedding;
