export const createImageEmbedding = async ({ record, api, logger, connections }) => {
    // only run if the product does not have an imageEmbedding, or if the image has changed
    if (!record.imageEmbedding || record.changed("image")) {
      try {
        // get a text description for the product image using the OpenAI connection
        const imageResponse = await connections.openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "What’s in this image?" },
                { type: "image_url", image_url: { url: record.image } },
              ],
            },
          ],
          max_tokens: 300,
        });
        const imageDescription = imageResponse.choices[0].message.content;
  
        // get an embedding for the image description using the OpenAI connection
        const textResponse = await connections.openai.embeddings.create({
          input: imageDescription,
          model: "text-embedding-ada-002",
        });
        const embedding = textResponse.data[0].embedding;
  
        // write to the Gadget Logs
        logger.info({ id: record.id }, "got image embedding");
  
        // use the internal API to store vector embedding in Gadget database, on shopifyProduct model
        await api.internal.shopifyProduct.update(record.id, { shopifyProduct: { imageEmbedding: embedding } });
      } catch (error) {
        logger.error({ error }, "error creating image embedding");
      }
    }
  };