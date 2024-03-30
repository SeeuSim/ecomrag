import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  UpdateShopifyProductActionContext,
} from 'gadget-server';
import { tryIncrShopSyncCount } from '../checkPlan';
import { postProductDescEmbedding } from '../publishSns';

/**
 * @param { UpdateShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { UpdateShopifyProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  if (tryIncrShopSyncCount({ params, record, logger, api, connections })) {
    await postProductDescEmbedding(
      { Id: record.id, Description: `${record.title}: ${record.body}` },
      record.shopId ?? 'DUMMYMSGGRPID',
      logger
    );
  }
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
};
