const { ActionOptions, SubscribeShopifyShopActionContext } = require('gadget-server');

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
- run function code for subscribe on Shopify Shop
- @param { import("gadget-server").SubscribeShopifyShopActionContext } context
  */
export async function run({ api, record, params, connections, logger }) {
  // get the plan object from the list of available plans
  const name = params.plan;
  const plan = PLANS[name];
  logger.info(params, 'params');
  logger.info(name, 'nameeeee');
  logger.info(plan.price, 'plan');
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
        test: true,
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
  await api.internal.shopifyShop.update(record.id, { confirmationUrl });

  logger.info({ appSubscriptionId: appSubscription?.id }, 'created subscription');
}

/**
 * @param { SubscribeShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
};

// add a paramter to this action to accept which plan name the merchant has selected
export const params = {
  plan: { type: 'string' },
};
