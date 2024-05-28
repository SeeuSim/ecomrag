import {
  transitionState,
  applyParams,
  save,
  ActionOptions,
  ShopifyShopState,
  InstallShopifyShopActionContext,
} from 'gadget-server';
import { postShopCreateResult } from '../../routes/main-backend/utils';

import { PLAN_LIMITS } from '../../plan/utils';

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
  const plan = /**@type { string }*/ (record.plan);
  // Create Plan
  api.plan.create({
    shop: {
      _link: record.id,
    },
    tier: plan.replace(/^\w/, (c) => c.toUpperCase()),
  });

  // TODO: Deprecate these lines in favor of separate Plan Model
  let productSyncLimit;
  let productImageSyncLimit;
  let chatSessionsLimit;
  switch (plan) {
    case 'growth':
      productSyncLimit = PLAN_LIMITS.Growth.productSyncCount; // Limit to 500 products for growth plan
      productImageSyncLimit = PLAN_LIMITS.Growth.imageUploadCount;
      chatSessionsLimit = 3000; // Limit to 500 chats per day for growth plan
      break;
    case 'premium':
      productSyncLimit = PLAN_LIMITS.Premium.productSyncCount; // Limit to 2000 products for premium plan
      productImageSyncLimit = PLAN_LIMITS.Premium.imageUploadCount;
      chatSessionsLimit = 15000; // Limit to 1000 chats per day for premium plan
      break;
    default:
      // Default is Free plan
      productSyncLimit = PLAN_LIMITS.Free.productSyncCount; // Limit to 100 products for free plan      | No limits for enterprise
      productImageSyncLimit = PLAN_LIMITS.Free.imageUploadCount;
      chatSessionsLimit = 600; // Limit to 30 chats per day for free plan | No limits for enterprise
  }
  // Update the record with the new limits
  record.productSyncLimit = productSyncLimit;
  record.productImageSyncLimit = productImageSyncLimit;
  record.chatSessionsLimit = chatSessionsLimit;
  record.subscriptionId = '';

  // Create Settings
  api.ChatbotSettings.create({
    shop: {
      _link: record.id,
    },
    role: 'ADVISOR',
    personality: 'FRIENDLY',
    talkativeness: '3',
    introductionMessage: "Hello! I'm your virtual assistant. How can I help you today?",
  });
  logger.info('Chatbot settings created');

  await save(record);

  await postShopCreateResult(record, logger);

  // Sync a limited number of products based on the plan
  if (productSyncLimit) {
    await api.shopifySync.run({
      shopifySync: {
        domain: record.domain,
        shop: {
          _link: record.id,
        },
        models: ['shopifyProduct', 'shopifyProductImage'],
      },
    });
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
