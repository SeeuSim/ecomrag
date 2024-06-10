import {
  ActionOptions,
  ReinstallShopifyShopActionContext,
  ShopifyShopState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  transitionState,
} from 'gadget-server';
import { postShopCreateResult } from '../../../routes/main-backend/utils';

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  if (!(record instanceof Object && record.state['created'] === 'uninstalled')) {
    transitionState(record, { from: ShopifyShopState.Uninstalled, to: ShopifyShopState.Installed });
  }
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { ReinstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
  try {
    // Create Plan
    const existingPlan = await api.plan.maybeFindFirst({
      filter: {
        shop: {
          equals: record.id,
        },
      },
    });
    if (!existingPlan) {
      api.plan.create({
        shop: {
          _link: record.id,
        },
      });
    }
    const chatbotSettings = await api.chatbotSettings.findFirst({
      filter: {
        shop: {
          equals: record.id,
        },
      },
    });
    if (!chatbotSettings) {
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
    }
    const [_postExternalResult, runSyncResult] = await Promise.all([
      postShopCreateResult(record, logger),
      api.shopifySync.run({
        domain: record.domain,
        shopifyShop: {
          _link: record.id,
        },
      }),
    ]);
    logger.info(runSyncResult, '[shopifyShop:reinstall] Ran Sync');
  } catch (error) {
    /**@type { Error } */
    const err = error;
    logger.error(
      {
        name: err.name,
        message: err.message,
        stack: err.stack,
        cause: err.cause,
      },
      '[shopifyShop:reinstall] An error occurred'
    );
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
  triggers: { api: true },
};
