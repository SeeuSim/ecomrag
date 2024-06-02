import { ActionOptions, SubscribeShopifyShopActionContext } from 'gadget-server';

// shopifyShop/subscribe.js

const PLANS = {
  Free: {
    price: 0.0,
  },
  Growth: {
    price: 9.0,
  },
  Premium: {
    price: 29.0,
  },
  Enterprise: {
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
 * run function code for subscribe on Shopify Shop
 * @param { { api: Client, record: ShopifyShop, params: {}, connections: unknown, logger: Logger } } context
 */
export async function run({ api: gadgetApi, record, params, connections, logger }) {
  const api = /** @type { import ('@gadget-client/ecomrag').Client } */ (gadgetApi);

  // get the plan object from the list of available plans
  const name = /**@type { keyof typeof PLANS } */ (
    params.plan.replace(/^\w/, (c) => c.toUpperCase())
  );
  const plan = PLANS[name];

  logger.info({ price: plan.price, isFree: plan.price <= 0 }, 'Price');

  if (!plan) throw new Error(`unknown plan name ${name}`);

  if (plan.price > 0) {
    // get an instance of the shopify-api-node API client for this shop
    const shopify = connections.shopify.current;

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
    logger.info({ appSubscriptionId: appSubscription?.id }, 'created subscription');
  }
}

/**
 * @param { SubscribeShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Any success code will be run on successful billing charge
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
  triggers: { api: true },
};

// add a paramter to this action to accept which plan name the merchant has selected
export const params = {
  plan: { type: 'string' },
};
