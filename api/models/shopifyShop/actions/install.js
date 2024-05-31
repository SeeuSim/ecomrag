import {
  transitionState,
  applyParams,
  save,
  ActionOptions,
  ShopifyShopState,
  InstallShopifyShopActionContext,
} from 'gadget-server';
import { postShopCreateResult } from '../../../routes/main-backend/utils';

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
  const tier = plan ? plan.replace(/^\w/, (c) => c.toUpperCase()) : 'Free';

  try {
    // Create Plan
    const existingPlan = await api.plan.findByShop(record.id);
    if (existingPlan) {
      await api.plan.update(existingPlan.id, {
        shop: {
          _link: record.id,
        },
        tier,
      });
    } else {
      api.plan.create({
        shop: {
          _link: record.id,
        },
        tier,
      });
    }
  } catch (error) {
    const { name, message, stack, cause } = /**@type { Error } */ (error);
    logger.error({ name, message, stack, cause }, 'Error occurred creating plan.');
    throw error;
  }

  // TODO: Deprecate these lines in favor of separate Plan Model
  let productSyncLimit;
  let productImageSyncLimit;
  let chatSessionsLimit;
  switch (plan) {
    case 'growth':
      productSyncLimit = PLAN_LIMITS.Growth.productSyncCount; // Limit to 500 products for growth plan
      productImageSyncLimit = PLAN_LIMITS.Growth.imageUploadCount;
      chatSessionsLimit = PLAN_LIMITS.Growth.chatSessionsCount; // Limit to 500 chats per day for growth plan
      break;
    case 'premium':
      productSyncLimit = PLAN_LIMITS.Premium.productSyncCount; // Limit to 2000 products for premium plan
      productImageSyncLimit = PLAN_LIMITS.Premium.imageUploadCount;
      chatSessionsLimit = PLAN_LIMITS.Premium.chatSessionsCount; // Limit to 1000 chats per day for premium plan
      break;
    case 'enterprise':
      productSyncLimit = PLAN_LIMITS.Enterprise.productSyncCount; // Limit to 2000 products for premium plan
      productImageSyncLimit = PLAN_LIMITS.Enterprise.imageUploadCount;
      chatSessionsLimit = PLAN_LIMITS.Enterprise.chatSessionsCount; // Limit to 1000 chats per day for premium plan
      break;
    default:
      // Default is Free plan
      productSyncLimit = PLAN_LIMITS.Free.productSyncCount; // Limit to 100 products for free plan      | No limits for enterprise
      productImageSyncLimit = PLAN_LIMITS.Free.imageUploadCount;
      chatSessionsLimit = PLAN_LIMITS.Free.chatSessionsCount; // Limit to 30 chats per day for free plan | No limits for enterprise
  }
  // Update the record with the new limits
  record.productSyncLimit = productSyncLimit;
  record.productImageSyncLimit = productImageSyncLimit;
  record.chatSessionsLimit = chatSessionsLimit;
  record.subscriptionId = '';

  try {
    // Create Settings
    await api.chatbotSettings.create({
      shop: {
        _link: record.id,
      },
      role: 'ADVISOR',
      personality: 'FRIENDLY',
      talkativeness: '3',
      introductionMessage: "Hello! I'm your virtual assistant. How can I help you today?",
    });
    logger.info('Chatbot settings created');
  } catch (error) {
    const { name, message, stack, cause } = /**@type { Error } */ (error);
    logger.error({ name, message, stack, cause }, 'Error occurred creating plan.');
    throw error;
  }

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
  triggers: { api: true },
};
