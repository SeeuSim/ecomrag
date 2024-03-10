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
  const plan = record.plan; // Assuming 'plan' is a field on the shopifyShop model
  let productLimit;
  let chatLimitPerDay;
  let includeImages = false;
  let imageUploadInChat = false;

  switch (plan) {
    case 'free':
      productLimit = 100; // Limit to 100 products for free plan
      chatLimitPerDay = 30; // Limit to 30 chats per day for free plan
      includeImages = false; // Do not sync images for free plan
      imageUploadInChat = false; // Disable image upload in chat for free plan
      break;
    case 'growth':
      productLimit = 500; // Limit to 500 products for growth plan
      chatLimitPerDay = 500; // Limit to 500 chats per day for growth plan
      includeImages = true; // Sync images for growth plan
      imageUploadInChat = true; // Enable image upload in chat for growth plan
      break;
    case 'premium':
      productLimit = 2000; // Limit to 2000 products for premium plan
      chatLimitPerDay = 1000; // Limit to 1000 chats per day for premium plan
      includeImages = true; // Sync images for premium plan
      imageUploadInChat = true; // Enable image upload in chat for premium plan
      break;
    // TODO: Add cases for enterprise plan
  }

  // Sync a limited number of products based on the plan
  if (productLimit) {
    await api.shopifySync.run({
      shopifySync: {
        domain: record.domain,
        shop: {
          _link: record.id,
        },
        models: ['shopifyProduct'],
        limit: productLimit, // Use the limit parameter to control the number of products
        includeImages: includeImages, // Control whether to include images in the sync
      },
    });
  }

  // Logic to handle chat limits and image upload functionality can be added here
  // ...
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
