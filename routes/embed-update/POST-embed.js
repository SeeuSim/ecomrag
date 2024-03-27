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
  /**@type { { model: string, field: string, embedding?: Array<number>, id: string }} */
  const { model, field, embedding, id } = request.body;

  if (!model || !field || !id) {
    await reply.code(401).type('text/plain').send('Invalid params');
    return;
  }

  let updateEmbedding = embedding ?? null;

  let record = undefined;
  switch (model) {
    case 'shopifyProduct':
      record = await api.shopifyProduct.findOne(id);
      break;
    case 'shopifyProductImage':
      record = await api.shopifyProductImage.findOne(id);
      break;
  }
  if (record === undefined) {
    await reply.code(401).type('text/plain').send('Invalid params, or record does not exist');
    return;
  }

  try {
    await record.update({
      [field]: updateEmbedding,
    });
    logger.info('Update successful for: ' + `ID: ${id}, FIELD: ${field}`);
    await reply.code(200).send();
  } catch (error) {
    await reply.code(500).type('text/plain').send(JSON.stringify(error));
  }
}
