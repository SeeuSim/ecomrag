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
    const allProductRecords = []; // use allRecords to store all records
    let productRecords = await api.shopifyProduct.findMany({
      first: 250,
      select: {
        id: true,
      },
    });

    allProductRecords.push(...productRecords);

    // loop through additional pages to get all protected orders
    while (productRecords.hasNextPage) {
      // paginate
      productRecords = await productRecords.nextPage();
      allProductRecords.push(...productRecords);
    }

    for (const record of allProductRecords) {
      await record.update({ descriptionEmbedding: null });
    }

    const allProductImageRecords = []; // use allRecords to store all records
    let productImageRecords = await api.shopifyProductImage.findMany({
      first: 250,
      select: {
        id: true,
      },
    });

    allProductRecords.push(...productRecords);

    // loop through additional pages to get all protected orders
    while (productRecords.hasNextPage) {
      // paginate
      productRecords = await productRecords.nextPage();
      allProductRecords.push(...productRecords);
    }

    for (const record of allProductRecords) {
      await record.update({ imageDescriptionEmbedding: null });
    }
    await reply.code(200).send();
  } catch (error) {
    logger.error(error);
    await reply.code(500).type('text/plain').send(JSON.stringify(error));
  }
}
