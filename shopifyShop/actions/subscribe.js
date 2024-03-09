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
 * This function creates a recurring charge with Shopify and returns the confirmation URL.
 * @param {Object} context - The action context provided by Gadget.
 */
async function createRecurringCharge(context) {
  const { api, record, params, connections, logger } = context;
  const name = params.plan;
  const plan = PLANS[name];
  if (!plan) throw new Error(`Unknown plan name: ${name}`);

  const shopify = connections.shopify.current;

  const CREATE_SUBSCRIPTION_QUERY = `
    mutation CreateSubscription($name: String!, $price: Decimal!) {
      appSubscriptionCreate(
        name: $name,
        test: true,
        returnUrl: "http://${api.config.appUrl}/finish-payment?shop_id=${record.id}",
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

  const result = await shopify.graphql(CREATE_SUBSCRIPTION_QUERY, {
    name,
    price: plan.price,
  });

  const { confirmationUrl, appSubscription } = result.appSubscriptionCreate;
  if (appSubscription) {
    await api.internal.shopifyShop.update(record.id, { confirmationUrl });
    logger.info({ appSubscriptionId: appSubscription.id }, 'Created subscription');
    return confirmationUrl;
  } else {
    const errors = result.appSubscriptionCreate.userErrors
      .map((error) => `${error.field}: ${error.message}`)
      .join(', ');
    throw new Error(`Failed to create app subscription: ${errors}`);
  }
}

module.exports = {
  actions: {
    subscribe: {
      run: createRecurringCharge,
      params: {
        plan: {
          type: 'string',
          required: true,
        },
      },
    },
  },
};
