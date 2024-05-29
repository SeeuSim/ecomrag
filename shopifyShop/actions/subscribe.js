import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { ActionOptions, SubscribeShopifyShopActionContext } from 'gadget-server';

import { PLAN_LIMITS } from '../../plan/utils';
import { getMessagePayload, stripHTMLTags } from '../../routes/batch-update/utils';

// shopifyShop/subscribe.js

const TEST_PLAN_LIMIT_ENFORCEMENT = process.env.NODE_ENV === 'development';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, EMBED_QUEUE_URL, CAPTION_QUEUE_URL } = process.env;

const client = new SQSClient({
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: 'us-east-1',
});

const PLANS = {
  free: {
    price: 1.0,
  },
  growth: {
    price: 9.0,
  },
  premium: {
    price: 29.0,
  },
  enterprise: {
    price: 199.0,
  },
};

/**
 * run function code for subscribe on Shopify Shop
 * @param { SubscribeShopifyShopActionContext } context
 */
export async function run({ api: gadgetApi, record, params, connections, logger }) {
  const api = /** @type { import ('@gadget-client/ecomrag').Client } */ (gadgetApi);

  // get the plan object from the list of available plans
  const name = /**@type { keyof typeof PLANS } */ (params.plan);
  const plan = PLANS[name];

  if (!plan) throw new Error(`unknown plan name ${name}`);

  // get an instance of the shopify-api-node API client for this shop
  const shopify = connections.shopify.current;

  logger.info(api, 'api');
  logger.info(connections, 'connections');

  logger.info(record, 'record');

  const CREATE_SUBSCRIPTION_QUERY = `
    mutation CreateSubscription($name: String!, $price: Decimal!) {
      appSubscriptionCreate(
        name: $name,
        test: null,
        returnUrl: "http://ecomrag.gadget.app/finish-payment?shop_id=${connections.shopify.currentShopId}",
        lineItems: [{
          plan: {
            appRecurringPricingDetails: {
              price: { amount: $price, currencyCode: USD }
              interval: EVERY_30_DAYS
            }
          }
        }]
      ) {
        userErrors {
          field
          message
        }
        confirmationUrl
        appSubscription {
          id
        }
      }
    }
  `;
  // make an API call to Shopify to create a charge object
  const result = await shopify.graphql(CREATE_SUBSCRIPTION_QUERY, {
    name,
    price: plan.price,
  });
  logger.info(result, 'result');

  const { confirmationUrl, appSubscription } = result.appSubscriptionCreate;

  // update this shop record to send the confirmation URL back to the frontend
  await api.internal.shopifyShop.update(record.id, {
    confirmationUrl: confirmationUrl,
    subscriptionId: appSubscription?.id,
  });

  // Plan Logic
  const existingPlanRecord = await api.plan.findByShop(record.id);
  const newPlanTier = /** @type { import('../../plan/utils').Plan['tier'] } */ (
    name.replace(/^\w/, (c) => c.toUpperCase())
  );

  if (existingPlanRecord.tier && TEST_PLAN_LIMIT_ENFORCEMENT) {
    const { tier: oldTier } = existingPlanRecord;
    let isUpgrade = false;
    switch (oldTier) {
      case 'Free':
        if (newPlanTier !== 'Free') {
          isUpgrade = true;
        }
        break;
      case 'Growth':
        if (['Premium', 'Enterprise'].includes(newPlanTier)) {
          isUpgrade = true;
        }
        break;
      case 'Premium':
        if (newPlanTier === 'Enterprise') {
          isUpgrade = true;
        }
        break;
      default: // Enterprise - new sub was made
        break;
    }

    // TODO: 1. If upgrade, sync to limit
    if (isUpgrade) {
      const imageEmbedQuota =
        PLAN_LIMITS[newPlanTier].imageUploadCount - (existingPlanRecord.imageUploadCount ?? 0);
      const productEmbedQuota =
        PLAN_LIMITS[newPlanTier].productSyncCount - (existingPlanRecord.productSyncCount ?? 0);

      const embedProducts = async () => {
        let successfulCount = 0;
        let failedEmbeds = [];
        let productPage = await api.shopifyProduct.findMany({
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
        let productsToEmbed = [...productPage];
        while (productPage.hasNextPage() && productsToEmbed.length < productEmbedQuota) {
          productPage = await productPage.nextPage();
          productsToEmbed = [...productsToEmbed, ...productPage];
        }
        productsToEmbed = productsToEmbed.slice(0, productEmbedQuota);

        for (let i = 0; i < productsToEmbed.length; i = i + 10) {
          let batch = productsToEmbed.slice(i, i + 10);
          const embedResult = await client.send(
            new SendMessageBatchCommand({
              QueueUrl: EMBED_QUEUE_URL,
              Entries: batch.map((v) => ({
                Id: v.id,
                MessageBody: 'Embed',
                MessageAttributes: getMessagePayload({
                  ...v,
                  model: 'shopifyProduct',

                  // TODO: change the body to a summary.
                  description: `${v.title}: ${stripHTMLTags(v.body)}`.slice(0, 77),
                }),
              })),
            })
          );
          successfulCount += embedResult.Successful.length;
          failedEmbeds = [...failedEmbeds, ...embedResult.Failed];
        }
        await api.internal.plan.update(existingPlanRecord.id, {
          _atomics: {
            productSyncCount: {
              increment: successfulCount,
            },
          },
        });
        return failedEmbeds;
      };
      const embedImages = async () => {
        let successfulCount = 0;
        let failedEmbeds = [];
        let imagePage = await api.shopifyProductImage.findMany({
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
        let imagesToEmbed = [...imagePage];
        while (imagePage.hasNextPage() && imagesToEmbed.length < imageEmbedQuota) {
          imagePage = await imagePage.nextPage();
          imagesToEmbed = [...imagesToEmbed, ...imagePage];
        }
        imagesToEmbed = imagesToEmbed.slice(0, imageEmbedQuota);

        for (let i = 0; i < imagesToEmbed.length; i = i + 10) {
          let batch = imagesToEmbed.slice(i, i + 10);
          const embedResult = await client.send(
            new SendMessageBatchCommand({
              QueueUrl: EMBED_QUEUE_URL,
              Entries: batch.map((v) => ({
                Id: v.id,
                MessageBody: 'Embed',
                MessageAttributes: getMessagePayload({
                  ...v,
                  model: 'shopifyProductImage',
                }),
              })),
            })
          );
          successfulCount += embedResult.Successful.length;
          failedEmbeds = [...failedEmbeds, ...embedResult.Failed];
        }
        await api.internal.plan.update(existingPlanRecord.id, {
          _atomics: {
            imageUploadCount: {
              increment: successfulCount / 2,
            },
          },
        });
        return failedEmbeds;
      };
      const captionImages = async () => {
        let successfulCount = 0;
        let failedCaptions = [];
        let imagePage = await api.shopifyProductImage.findMany({
          filter: {
            imageDescription: {
              isSet: false,
            },
          },
          select: {
            id: true,
            source: true,
            shopId: true,
          },
        });
        let imagesToCaption = [...imagePage];
        while (imagePage.hasNextPage() && imagesToCaption.length < imageEmbedQuota) {
          imagePage = await imagePage.nextPage();
          imagesToCaption = [...imagesToCaption, ...imagePage];
        }
        imagesToCaption = imagesToCaption.slice(0, imageEmbedQuota);

        for (let i = 0; i < imagesToCaption.length; i = i + 10) {
          let batch = imagesToCaption.slice(i, i + 10);
          const captionResult = await client.send(
            new SendMessageBatchCommand({
              QueueUrl: CAPTION_QUEUE_URL,
              Entries: batch.map((v) => ({
                Id: v.id,
                MessageBody: 'Caption',
                MessageAttributes: getMessagePayload({
                  ...v,
                  model: 'shopifyProductImage',
                }),
              })),
            })
          );
          successfulCount += captionResult.Successful.length;
          failedCaptions = [...failedCaptions, ...captionResult.Failed];
        }
        await api.internal.plan.update(existingPlanRecord.id, {
          _atomics: {
            imageUploadCount: {
              increment: successfulCount / 2,
            },
          },
        });
        return failedCaptions;
      };

      // TODO: redrive
      const [failedProductEmbeds, failedImageEmbeds, failedImageCaptions] = await Promise.all([
        embedProducts(),
        embedImages(),
        captionImages(),
      ]);
    } else {
      // TODO: 2. Else, downgrade to limit or even delete images if Free (or bill for use until they manually delete?)
      if (newPlanTier === 'Free') {
        // Delete all images
        const imageRecords = await api.shopifyProductImage.findMany({
          where: {
            shopId: record.id,
          },
        });
        let imagesToDelete = [...imageRecords];
        while (imageRecords.hasNextPage) {
          imageRecords = await imageRecords.nextPage();
          imagesToDelete = [...imagesToDelete, ...imageRecords];
        }
        await api.shopifyProductImage.bulkDelete(imagesToDelete.map((v) => v.id));
      } else {
        // Downgrade images to limit
        const exceeded =
          existingPlanRecord.imageUploadCount ?? 0 - PLAN_LIMITS[newPlanTier].imageUploadCount;
        if (exceeded > 0) {
          let imagePage = await api.shopifyProductImage.findMany({
            filter: {
              imageDescriptionEmbedding: {
                isSet: true,
              },
            },
          });
          let imagesToUpdate = [...imagePage];
          while (imagePage.hasNextPage() && imagesToUpdate.length < exceeded) {
            imagePage = await imagePage.nextPage();
            imagesToUpdate = [...imagesToUpdate, ...imagePage];
          }
          await api.shopifyProductImage.bulkUpdate(
            imagesToUpdate.slice(0, exceeded).map((v) => ({
              id: v.id,
              imageDescription: null,
              imageDescriptionEmbedding: null,
            }))
          );
          await api.plan.update(existingPlanRecord.id, {
            imageUploadCount: PLAN_LIMITS[newPlanTier].imageUploadCount,
          });
        }
      }

      // Downgrade products to limit
      const exceeded =
        existingPlanRecord.productSyncCount ?? 0 - PLAN_LIMITS[newPlanTier].productSyncCount;
      if (exceeded > 0) {
        let productPage = await api.shopifyProduct.findMany({
          where: {
            productDescriptionEmbedding: {
              isSet: true,
            },
          },
        });
        let productsToStrip = [...productPage];
        while (productPage.hasNextPage() && productsToStrip.length < exceeded) {
          productPage = await productPage.nextPage();
          productsToStrip = [...productsToStrip, ...productPage];
        }
        await api.shopifyProduct.bulkUpdate(
          productsToStrip.map((v) => ({
            id: v.id,
            descriptionEmbedding: null,
          }))
        );
        await api.plan.update(existingPlanRecord.id, {
          productSyncCount: PLAN_LIMITS[newPlanTier].productSyncCount,
        });
      }
    }
  }

  await api.plan.update(existingPlanRecord.id, {
    tier: newPlanTier,
  });

  logger.info({ appSubscriptionId: appSubscription?.id }, 'created subscription');
}

/**
 * @param { SubscribeShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
};

// add a paramter to this action to accept which plan name the merchant has selected
export const params = {
  plan: { type: 'string' },
};
