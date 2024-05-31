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
  const plan = /**@type { string | undefined }*/ (record.plan);
  // Create Plan
  api.plan.create({
    shop: {
      _link: record.id,
    },
    tier: plan ? plan.replace(/^\w/, (c) => c.toUpperCase()) : 'Free',
  });

  // TODO: Deprecate these lines in favor of separate Plan Model
  let productSyncLimit;
  let productImageSyncLimit;
  let chatSessionsLimit;
  switch (plan) {
    case 'growth':
      productSyncLimit = PLAN_LIMITS.Growth.productSyncCount; // Limit to 500 products for growth plan
      productImageSyncLimit = PLAN_LIMITS.Growth.imageUploadCount;
      chatSessionsLimit = PLAN_LIMITS.Growth.chatSessionsLimit; // Limit to 500 chats per day for growth plan
      break;
    case 'premium':
      productSyncLimit = PLAN_LIMITS.Premium.productSyncCount; // Limit to 2000 products for premium plan
      productImageSyncLimit = PLAN_LIMITS.Premium.imageUploadCount;
      chatSessionsLimit = PLAN_LIMITS.Premium.chatSessionsLimit; // Limit to 1000 chats per day for premium plan
      break;
    case 'enterprise':
      productSyncLimit = PLAN_LIMITS.Enterprise.productSyncCount; // Limit to 2000 products for premium plan
      productImageSyncLimit = PLAN_LIMITS.Enterprise.imageUploadCount;
      chatSessionsLimit = PLAN_LIMITS.Enterprise.chatSessionsLimit; // Limit to 1000 chats per day for premium plan
      break;
    default:
      // Default is Free plan
      productSyncLimit = PLAN_LIMITS.Free.productSyncCount; // Limit to 100 products for free plan      | No limits for enterprise
      productImageSyncLimit = PLAN_LIMITS.Free.imageUploadCount;
      chatSessionsLimit = PLAN_LIMITS.Free.chatSessionsLimit; // Limit to 30 chats per day for free plan | No limits for enterprise
  }
  // Update the record with the new limits
  record.productSyncLimit = productSyncLimit;
  record.productImageSyncLimit = productImageSyncLimit;
  record.chatSessionsLimit = chatSessionsLimit;
  record.subscriptionId = '';

  // Create Settings
  api.chatbotSettings.create({
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

  // Sync logic will tie together with plan, as will image creation
  // See shopifyProduct:create/update, shopifyProductImage:create/update
  await api.shopifySync.run({
    shopifySync: {
      domain: record.domain,
      shop: {
        _link: record.id,
      },
    },
  });
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
