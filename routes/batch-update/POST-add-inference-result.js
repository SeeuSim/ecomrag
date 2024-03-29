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
  /**@type {{ isBatch: boolean; payload: { model: string; field: string; id: string; value: string | Array<number> } | { model: string, data: Array<{ field: string; id: string; value: string | Array<number> }> }}} */
  const data = request.body;

  if (
    !data.payload ||
    !data.payload.model ||
    ((!data.payload.id || !data.payload.field || !data.payload.value) &&
      (!data.payload.data || !Array.isArray(data.payload.data)))
  ) {
    await reply.code(401).send();
    return;
  }

  try {
    if (data.isBatch) {
      switch (data.payload.model) {
        case 'shopifyProduct':
          await Promise.all(
            data.payload.data.map((record) =>
              api.internal.shopifyProduct.update(record.id, { [record.field]: record.value })
            )
          );
          break;
        case 'shopifyProductImage':
          await Promise.all(
            data.payload.data.map((record) =>
              api.internal.shopifyProductImage.update(record.id, { [record.field]: record.value })
            )
          );
          break;
      }
    } else {
      switch (data.payload.model) {
        case 'shopifyProduct':
          await api.internal.shopifyProduct.update(data.payload.id, {
            [data.payload.field]: data.payload.value,
          });
          break;
        case 'shopifyProductImage':
          await api.internal.shopifyProductImage.update(data.payload.id, {
            [data.payload.field]: data.payload.value,
          });
          break;
      }
    }
    await reply.code(200).send();
  } catch (error) {
    logger.error('Update failed: ' + JSON.stringify(error));
    await reply.code(500).send(JSON.stringify(error));
  }
}
