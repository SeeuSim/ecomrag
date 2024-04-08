import { api, logger } from 'gadget-server';
import { Request, Reply } from 'gadget-server';

/**
 * Sends a singular embed update. You may post the request to /embed-update/embed with the following JSON fields:
 * @param request A JSON object with the following keys:
 *   - `model`: The Shopify model in the Gadget database.
 *   - `id`: The record's ID.
 *   - `field`: The field to update.
 *   - `embedding`: The embedding to update with.
 *
 * @type { (params: { request: Request, reply: Reply, api: typeof api, logger: typeof logger }) => Promise<void> }
 **/
export default async function route({ request, reply, api, logger, connections }) {
  try {
    const data = request.body;

    if (data.Model && data.Model == 'shopifyProduct') {
      let productRecords = await api.shopifyProduct.findMany({
        first: 250,
        select: {
          id: true,
        },
      });

      await api.shopifyProduct.bulkUpdate(
        productRecords.map((record) => ({
          id: record.id,
          descriptionEmbedding: null,
        }))
      );

      while (productRecords.hasNextPage) {
        productRecords = await productRecords.nextPage();
        await api.shopifyProduct.bulkUpdate(
          productRecords.map((record) => ({
            id: record.id,
            descriptionEmbedding: null,
          }))
        );
      }
    }
    if (data.Model && data.Model === 'shopifyProductImage') {
      let productImageRecords = await api.shopifyProductImage.findMany({
        first: 250,
        select: {
          id: true,
        },
        filter: {
          imageDescriptionEmbedding: {
            isSet: true,
          },
        },
      });

      await Promise.all(
        productImageRecords.map((record) =>
          api.internal.shopifyProductImage.update(record.id, {
            imageDescriptionEmbedding: null,
            imageDescription: null,
          })
        )
      );

      while (productImageRecords.hasNextPage) {
        productImageRecords = await productImageRecords.nextPage();
        await Promise.all(
          productImageRecords.map((record) =>
            api.internal.shopifyProductImage.update(record.id, {
              imageDescriptionEmbedding: null,
              imageDescription: null,
            })
          )
        );
      }
    }

    await reply.code(200).send();
  } catch (error) {
    logger.error('Error occurred during reset', error);
    await reply.code(500).type('text/plain').send(JSON.stringify(error));
  }
}
