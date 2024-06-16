import {
  ActionOptions,
  UpdateShopifyProductActionContext,
  applyParams,
  preventCrossShopDataAccess,
  save,
} from 'gadget-server';
import { postProductUpdateResult } from '../../../routes/main-backend/utils';
// import { tryIncrProductSyncCount } from '../checkPlan';
import { postProductDescEmbedding } from '../postSqs';

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
export async function onSuccess({ record, logger, api, params: _p, connections: _c }) {
  const isEmbed =
    !record.getField('descriptionEmbedding') || record.changed('title') || record.changed('body');
  if (isEmbed) {
    const description = `${record.title}: ${record.body}`;
    await postProductDescEmbedding(
      { Id: record.id, Description: description },
      record.shopId ?? 'DUMMYMSGGRPID',
      logger
    );
  }
  await postProductUpdateResult(record, logger);
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
  triggers: { api: true },
};
