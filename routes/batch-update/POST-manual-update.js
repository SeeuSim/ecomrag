import { api, logger, Request, Reply } from 'gadget-server';
import { SNSClient, PublishBatchCommand } from '@aws-sdk/client-sns';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBED_TOPIC_ARN, CAPTION_TOPIC_ARN } = process.env;

const client = new SNSClient({
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

  for (let i = 0; i < aggr.length; i = i + 10) {
    let pl = aggr.slice(i, i + 10);
    const [captionResult, embedResult] = await Promise.all([
      client.send(
        new PublishBatchCommand({
          TopicArn: CAPTION_TOPIC_ARN,
          PublishBatchRequestEntries: pl.map((v) => ({
            Id: `${v.shopId}|${v.id}`,
            Message: 'Caption',
            MessageAttributes: {
              Id: {
                DataType: 'String',
                StringValue: `${v.id}`,
              },
              Model: {
                DataType: 'String',
                StringValue: 'shopifyProductImage',
              },
              Source: {
                DataType: 'String',
                StringValue: v.source,
              },
            },
          })),
        })
      ),
      client.send(
        new PublishBatchCommand({
          TopicArn: EMBED_TOPIC_ARN,
          PublishBatchRequestEntries: pl.map((v) => ({
            Id: `${v.shopId}|${v.id}`,
            Message: 'Embed',
            MessageAttributes: {
              Id: {
                DataType: 'String',
                StringValue: `${v.id}`,
              },
              Model: {
                DataType: 'String',
                StringValue: 'shopifyProductImage',
              },
              Source: {
                DataType: 'String',
                StringValue: v.source,
              },
            },
          })),
        })
      ),
    ]);
    const successfulCaptions = captionResult.Successful?.map(
      (v) => v.Id?.split('|')[0] ?? ''
    ).filter((v) => v.length > 0);
    successfulCaptions.forEach((v) => {
      if (counts[v]) {
        counts[v] += 0.5;
      } else {
        counts[v] = 0.5;
      }
    });
    const successfulEmbeds = embedResult.Successful?.map((v) => v.Id?.split('|')[0] ?? '').filter(
      (v) => v.length > 0
    );
    successfulEmbeds.forEach((v) => {
      if (counts[v]) {
        counts[v] += 0.5;
      } else {
        counts[v] = 0.5;
      }
    });
  }

  for (const [id, count] of Object.entries(counts)) {
    const shop = await api.shopifyShop.findOne(id);
    await api.internal.shopifyShop.update(id, {
      productImageSyncCount: Number(shop.productImageSyncCount) + Number(count),
    });
    logger.info({}, `Updated shopId ${id} with ${count} embeds/captions`);
  }

  await reply
    .code(200)
    .type('text/plain')
    .send(`Sent: ${aggr.length * 2} Jobs`);
}
