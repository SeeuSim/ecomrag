import {
  ActionOptions,
  CreateShopifyProductActionContext,
  applyParams,
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
  api,
  params: _params,
  connections: _connections,
}) {
  const isEmbed = await tryIncrProductSyncCount({ record, logger, api });
  if (isEmbed) {
    await postProductDescEmbedding(
      { Id: record.id, Description: `${record.title}: ${record.body}` },
      record.shopId ?? 'DUMMYMSGGRPID',
      logger
    );
  }
  await postProductCreateResult(record, logger);
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
  triggers: { api: true },
};
