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
  // Link the plan record
  try {
    // Create Plan
    const existingPlan = await api.plan.maybeFindFirst({
      filter: {
        shop: {
          equals: record.id,
        },
      },
    });
    if (existingPlan) {
      await api.plan.update(existingPlan.id, {
        shop: {
          _link: record.id,
        },
      });
    } else {
      api.plan.create({
        shop: {
          _link: record.id,
        },
      });
    }
  } catch (error) {
    const { name, message, stack, cause } = /**@type { Error } */ (error);
    logger.error({ name, message, stack, cause }, 'Error occurred creating plan.');
    throw error;
  }

  record.subscriptionId = '';

  try {
    // Create Settings
    await api.chatbotSettings.create({
      shop: {
        _link: record.id,
      },
      name: record.name,
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

  await postShopCreateResult(record, logger, api);

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
