import { api, logger } from 'gadget-server';
import { Request, Reply } from 'gadget-server';
import { postProductImgEmbedCaption } from '../../shopifyProductImage/postSqs';

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
  let aggr = [];
  let counts = {};
  let res = await api.shopifyProductImage.findMany({
    filter: {
      imageDescriptionEmbedding: {
        isSet: false,
      },
    },
    select: {
      id: true,
      source: true,
      shopId: true,
    },
  });
  res.forEach((v) => aggr.push(v));
  while (res.hasNextPage) {
    res = await res.nextPage();
    res.forEach((v) => aggr.push(v));
  }

  aggr.forEach((v) => {
    if (counts[v.shopId]) {
      counts[v.shopId] += 1;
    } else {
      counts[v.shopId] = 1;
    }
    postProductImgEmbedCaption(
      {
        Id: v.id,
        Source: v.source,
      },
      { Caption: true, Embed: true },
      v.shopId,
      logger
    );
  });

  for (const [id, count] of Object.entries(counts)) {
    const shop = await api.shopifyShop.findOne(id);
    await api.internal.shopifyShop.update(id, {
      productImageSyncCount: Number(shop.productImageSyncCount) + Number(count)
    });
    logger.info({}, `Updated shopId ${id} with ${count} embeds/captions`);
  }

  await reply
    .code(200)
    .type('text/plain')
    .send('Done');
}
