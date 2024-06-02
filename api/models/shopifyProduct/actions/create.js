import {
  ActionOptions,
  CreateShopifyProductActionContext,
  applyParams,
  deleteRecord,
  preventCrossShopDataAccess,
  save,
} from 'gadget-server';
import { postProductCreateResult } from '../../../routes/main-backend/utils';
import { tryIncrProductSyncCount } from '../checkPlan';
import { postProductDescEmbedding } from '../postSqs';

/**
 * @param { CreateShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  // TODO: Check for variant @jamesliu
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyProductActionContext } context
 */
export async function onSuccess({
  record,
  logger,
  api: _api,
  params: _params,
  connections: _connections,
}) {
  const isWithinLimit = await tryIncrProductSyncCount({
    record,
    api,
    logger,
  });
  if (!isWithinLimit) {
    await deleteRecord(record);
    return;
  }
  const description = `${record.title}: ${record.body}`;
  await Promise.all([
    postProductDescEmbedding(
      { Id: record.id, Description: description },
      record.shopId ?? 'DUMMYMSGGRPID',
      logger
    ),
    postProductCreateResult(record, logger),
  ]);
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
  triggers: { api: true },
};
