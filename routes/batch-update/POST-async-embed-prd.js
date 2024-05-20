import { api, logger, Request, Reply } from 'gadget-server';
import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { getMessagePayload, stripHTMLTags } from './utils';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBED_QUEUE_URL } = process.env;

const client = new SQSClient({
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: 'us-east-1',
});

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
  let res = await api.shopifyProduct.findMany({
    filter: {
      descriptionEmbedding: {
        isSet: false,
      },
    },
    select: {
      id: true,
      title: true,
      body: true,
      shopId: true,
    },
  });
  res.forEach((v) => aggr.push(v));
  while (res.hasNextPage) {
    res = await res.nextPage();
    res.forEach((v) => aggr.push(v));
  }
  logger.info(`Total jobs: ${aggr.length}`);

  for (let i = 0; i < aggr.length; i = i + 10) {
    let pl = aggr.slice(i, i + 10);
    const embedResult = await client.send(
      new SendMessageBatchCommand({
        QueueUrl: EMBED_QUEUE_URL,
        Entries: pl.map((v, index) => ({
          Id: `${v.shopId}${index}`,
          MessageBody: 'Embed',
          MessageAttributes: getMessagePayload({
            ...v,
            model: 'shopifyProduct',

            // TODO: change the body to a summary.
            description: `${v.title}: ${stripHTMLTags(v.body)}`.slice(0, 77),
          }),
          // MessageGroupId: `${record.shopId}`
        })),
      })
    );

    const successfulEmbeds = embedResult.Successful.map((v) => {
      return v.Id.slice(0, v.Id.length - 1);
    });
    successfulEmbeds.forEach((v) => {
      if (counts[v]) {
        counts[v] += 1;
      } else {
        counts[v] = 1;
      }
    });
  }

  for (const [id, count] of Object.entries(counts)) {
    if (!id.matchAll(/^\d+$/g)) {
      continue;
    }
    const shop = await api.shopifyShop.findOne(id);
    await api.internal.shopifyShop.update(id, {
      productSyncCount: Number(shop.productSyncCount) + Number(count),
    });
    logger.info({}, `Updated shopId ${id} with ${count / 0.5} product embeds`);
  }
  logger.info('Total jobs: ' + `${aggr.length}`);

  await reply.code(200).type('text/plain').send(`Sent: ${aggr.length} Jobs`);
}
