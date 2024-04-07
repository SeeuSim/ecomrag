import {
  transitionState,
  applyParams,
  save,
  ActionOptions,
  ShopifyShopState,
  InstallShopifyShopActionContext,
} from 'gadget-server';

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, { to: ShopifyShopState.Installed });
  applyParams(params, record);
  await save(record);
}

/**
 * @param { InstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Logic to determine the plan and set limits accordingly
  const plan = record.plan;
  let productSyncLimit;
  let productImageSyncLimit;
  let chatSessionsLimit;

  switch (plan) {
    case 'free':
      productSyncLimit = 100; // Limit to 100 products for free plan
      productImageSyncLimit = 100;
      chatSessionsLimit = 600; // Limit to 30 chats per day for free plan
      break;
    case 'growth':
      productSyncLimit = 500; // Limit to 500 products for growth plan
      productImageSyncLimit = 1000;
      chatSessionsLimit = 3000; // Limit to 500 chats per day for growth plan
      break;
    case 'premium':
      productSyncLimit = 2000; // Limit to 2000 products for premium plan
      productImageSyncLimit = 4000;
      chatSessionsLimit = 15000; // Limit to 1000 chats per day for premium plan
      break;
    default:
      // Default is free plan
      productSyncLimit = 100; // No limit for enterprise plan
      productImageSyncLimit = 100;
      chatSessionsLimit = 600; // No limit for enterprise planq
  }

  // Update the record with the new limits
  record.productSyncLimit = productSyncLimit;
  record.productImageSyncLimit = productImageSyncLimit;
  record.chatSessionsLimit = chatSessionsLimit;

  await save(record);

  // Sync a limited number of products based on the plan
  if (productSyncLimit) {
    await api.shopifySync.run({
      shopifySync: {
        domain: record.domain,
        shop: {
          _link: record.id,
        },
        models: ['shopifyProduct'],
        // limit: productSyncLimit, // Use the limit parameter to control the number of products
      },
    });
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
