import { ActionOptions, SubscribeShopifyShopActionContext } from 'gadget-server';

import { PLAN_LIMITS } from '../../plan/utils';

// shopifyShop/subscribe.js

const PLANS = {
  free: {
    price: 0.0,
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
 * @typedef { import ('@gadget-client/ecomrag').Client } Client
 */

/**
 * @typedef { import ('gadget-server').Logger } Logger
 */

/**
 * @typedef { Awaited<ReturnType<Client['shopifyShop']['findOne']>> } ShopifyShop
 */

/**
 *
 * @param { { api: Client, record: ShopifyShop, logger: Logger, planName: string } } context
 */
async function validatePlanUsage({ api, record, logger, planName: name }) {
  const existingPlanRecord = await api.plan.findByShop(record.id);
  const newPlanTier = /** @type { import('../../plan/utils').Plan['tier'] } */ (
    name.replace(/^\w/, (c) => c.toUpperCase())
  );

  logger.info(
    {},
    `[validatePlanUsage] Subscription: Changing from ${existingPlanRecord.tier} to ${newPlanTier}`
  );

  if (existingPlanRecord.tier) {
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
      default: // Enterprise -> lower tier
        break;
    }

    // 1. If upgrade, sync to limit
    if (isUpgrade) {
      logger.info({}, 'Upgrade - running sync');
      await api.shopifySync.run({
        domain: record.domain,
        shop: {
          _link: record.id,
        },
      });
    } else {
      logger.info({}, 'Downgrade - removing excessive resources');
      // 2. Else, downgrade to limit or even delete images if Free (or bill for use until they manually delete?)
      const downgradeImages = async () => {
        if (newPlanTier === 'Free') {
          // Delete all images
          logger.info({}, 'Free Tier - Deleting all images');
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
          logger.info({}, `${newPlanTier} Tier - Removing excessive image embeddings`);
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
                imageDescriptionEmbedding: null,
              }))
            );
            await api.plan.update(existingPlanRecord.id, {
              imageUploadCount: PLAN_LIMITS[newPlanTier].imageUploadCount,
            });
          }
        }
      };

      const downgradeProducts = async () => {
        const exceeded =
          existingPlanRecord.productSyncCount ?? 0 - PLAN_LIMITS[newPlanTier].productSyncCount;
        if (exceeded > 0) {
          logger.info('Downgrade - Removing excessive product embeddings');
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
      };

      await Promise.all([downgradeImages(), downgradeProducts()]);
    }
  }

  await api.plan.update(existingPlanRecord.id, {
    tier: newPlanTier,
  });
}

/**
 * run function code for subscribe on Shopify Shop
 * @param { { api: Client, record: ShopifyShop, params: {}, connections: unknown, logger: Logger } } context
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
  await validatePlanUsage({ api, record, planName: name });

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
