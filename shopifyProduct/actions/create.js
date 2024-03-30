import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyProductActionContext,
} from 'gadget-server';
import { tryIncrShopSyncCount } from '../checkPlan';
import { postProductDescEmbedding } from '../postSqs';

/**
 * @param { CreateShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  // const shop = await api.shopifyShop.findOne({
  //   where: { id: connections.shopify.current.id }
  // });
  // const productSyncLimit = shop.productSyncLimit;

  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  if (tryIncrShopSyncCount({ params, record, logger, api, connections })) {
    await postProductDescEmbedding(
      { Id: record.id, Description: `${record.title}: ${record.body}` },
      record.shopId ?? 'DUMMYMSGGRPID',
      logger
    );
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
