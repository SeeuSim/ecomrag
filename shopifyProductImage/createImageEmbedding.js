import AWS from 'aws-sdk';
import { log } from 'console';
import fetch from 'node-fetch';
import { Image } from 'canvas';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME, EMBEDDING_ENDPOINT } = process.env;

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

async function downloadImage(url) {
  console.log(url);
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadImage(image) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${Date.now().toString()}.jpg`,
    Body: image,
  };
  const response = await s3.upload(params).promise();
  return response.Location;
}

// async function resizeImage(imageBuffer) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.src = URL.createObjectURL(new Blob([imageBuffer]));
//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       const MAX_WIDTH = 384;
//       const MAX_HEIGHT = 384;
//       let width = img.width;
//       let height = img.height;

//       if (width > height) {
//         if (width > MAX_WIDTH) {
//           height *= MAX_WIDTH / width;
//           width = MAX_WIDTH;
//         }
//       } else {
//         if (height > MAX_HEIGHT) {
//           width *= MAX_HEIGHT / height;
//           height = MAX_HEIGHT;
//         }
//       }

//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(img, 0, 0, width, height);
//       canvas.toBlob(resolve, 'image/jpeg');
//     };
//     img.onerror = reject;
//   });
// }

const createProductImageEmbedding = async ({ record, api, logger, connections }) => {
  if (!record.imageEmbedding || record.changed('image')) {
    try {
      logger.info({ record: record }, 'this is the record object');
      const imageUrl = record.source;
      const imageBuffer = await downloadImage(imageUrl);
      //const resizedImageBuffer = await resizeImage(imageBuffer);

      const response = await fetch(EMBEDDING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg', Accept: 'application/json' },
        //body: resizedImageBuffer,
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

export default createProductImageEmbedding;

module.exports = {
  run: createProductImageEmbedding,
  timeoutMS: 900000,
};

//Required export in Gadget syntax
module.exports.createProductImageEmbedding = createProductImageEmbedding;
