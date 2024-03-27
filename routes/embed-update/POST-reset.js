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
    const products = await api.shopifyProduct.all();
    for (const record of products) {
      try {
        await record.update({
          descriptionEmbedding: null,
        });
      } catch (error) {
        logger.error(error);
      }
    }

    const productImages = await api.shopifyProductImage.all();
    for (const record of productImages) {
      try {
        await record.update({
          imageDescriptionEmbedding: null,
        });
      } catch (error) {
        logger.error(error);
      }
    }
    await reply.code(200).send();
  } catch (error) {
    logger.error(error);
    await reply.code(500).type('text/plain').send(JSON.stringify(error));
  }
}
