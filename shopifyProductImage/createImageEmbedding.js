import fetch from 'node-fetch';
import { logger } from 'gadget-server';

const { EMBEDDING_ENDPOINT } = process.env;

export async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export const createProductImageEmbedding = async ({ record, api, logger, connections }) => {
  if (!record.imageEmbedding || record.changed('image')) {
    try {
      logger.info({ record: record }, 'this is the record object');
      const imageUrl = record.source;
      const imageBuffer = await downloadImage(imageUrl);

      const response = await fetch(EMBEDDING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg', Accept: 'application/json' },
        body: imageBuffer,
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error({ error }, 'An error occurred fetching the embedding.');
        return;
      }

      const payload = await response.json();

      if (!payload.Embedding || !Array.isArray(payload.Embedding)) {
        logger.error({
          error: `Expected a response with one key 'Embedding', received object with keys: ${Object.keys(payload)}`,
        });
        return;
      }

      const embedding = payload.Embedding;

      logger.info({ id: record.id }, 'got image embedding');

      await api.internal.shopifyProductImage.update(record.id, {
        shopifyProductImage: { imageDescriptionEmbedding: embedding },
      });
    } catch (error) {
      logger.error({ error }, 'error creating image embedding');
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
