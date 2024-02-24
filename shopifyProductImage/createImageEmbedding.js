import AWS from 'aws-sdk';
import fetch from 'node-fetch';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } = process.env;

AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

async function downloadImage(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadImage(image) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${Date.now().toString()}.jpg`,
    Body: image
  };
  const response = await s3.upload(params).promise();
  return response.Location;
}

async function resizeImage(imageBuffer) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(new Blob([imageBuffer]));
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const MAX_WIDTH = 384;
      const MAX_HEIGHT = 384;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg');
    };
    img.onerror = reject;
  });
}

export const createImageEmbedding = async ({ record, api, logger, connections }) => {
  if (!record.imageEmbedding || record.changed("image")) {
    try {
      const imageUrl = record.image;
      const imageBuffer = await downloadImage(imageUrl);
      const resizedImageBuffer = await resizeImage(imageBuffer);
      const resizedImageUrl = await uploadImage(resizedImageBuffer);

      const imageResponse = await connections.openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What’s in this image?" },
              { type: "image_url", image_url: { url: resizedImageUrl } },
            ],
          },
        ],
        max_tokens: 300,
      });
      const imageDescription = imageResponse.choices[0].message.content;

      const textResponse = await connections.openai.embeddings.create({
        input: imageDescription,
        model: "text-embedding-ada-002",
      });
      const embedding = textResponse.data[0].embedding;

      logger.info({ id: record.id }, "got image embedding");

      await api.internal.shopifyProduct.update(record.id, { shopifyProduct: { imageEmbedding: embedding } });
    } catch (error) {
      logger.error({ error }, "error creating image embedding");
    }
  }
};