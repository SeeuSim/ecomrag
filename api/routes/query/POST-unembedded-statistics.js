import { Reply, Request } from 'gadget-server';

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
  let data = request.body;

  let aggr = [];

  switch (data.Model) {
    case 'shopifyProductImage':
      let iRes = await api.shopifyProductImage.findMany({
        filter: {
          imageDescriptionEmbedding: {
            isSet: false,
          },
        },
        select: {
          id: true,
          shopId: true,
        },
      });
      iRes.forEach((v) => aggr.push(v));
      while (iRes.hasNextPage) {
        iRes = await iRes.nextPage();
        iRes.forEach((v) => aggr.push(v));
      }
      await reply
        .code(200)
        .type('application/json')
        .send({ count: aggr.length, model: 'shopifyProductImage' });
      return;
    case 'shopifyProduct':
      console.log('Starting...');
      let pRes = await api.shopifyProduct.findMany({
        filter: {
          descriptionEmbedding: {
            isSet: false,
          },
        },
        select: {
          id: true,
          shopId: true,
        },
      });
      pRes.forEach((v) => aggr.push(v));
      while (pRes.hasNextPage) {
        pRes = await pRes.nextPage();
        pRes.forEach((v) => aggr.push(v));
      }
      await reply
        .code(200)
        .type('application/json')
        .send({ count: aggr.length, model: 'shopifyProduct' });
  }
}
