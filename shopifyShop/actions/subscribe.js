import { ActionOptions, SubscribeShopifyShopActionContext } from 'gadget-server';
import { PLAN_LIMITS } from '../../plan/utils';

// shopifyShop/subscribe.js

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
        if (!['Free', 'Growth'].includes(newPlanTier)) {
          isUpgrade = true;
        }
        break;
      case 'Premium':
        if (newPlanTier === 'Enterprise') {
          isUpgrade = true;
        }
        break;
    }

    // TODO: 1. If upgrade, sync to limit
    if (isUpgrade) {
      const imageEmbeds =
        PLAN_LIMITS[newPlanTier].imageUploadCount - (existingPlanRecord.imageUploadCount ?? 0);
      const productEmbeds =
        PLAN_LIMITS[newPlanTier].productSyncCount - (existingPlanRecord.productSyncCount ?? 0);

      // TODO: Embed Products, Embed + Caption Images (which aren't embedded yet)
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
      }

      // TODO: Downgrade to limit
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
