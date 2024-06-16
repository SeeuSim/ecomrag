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
import { PLAN_LIMITS } from '../../plan/utils';

/**
 * @param { CreateShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  // TODO: Check for variant @jamesliu
  applyParams(params, record);
  // const shop = await api.shopifyShop.maybeFindFirst({
  //   filter: {
  //     id: {
  //       equals: record.shopId,
  //     },
  //   },
  //   select: {
  //     productCount: true,
  //     plan: {
  //       tier: true,
  //     },
  //   },
  // });
  // if (shop) {
  //   if (shop.plan?.tier) {
  //     const limit = PLAN_LIMITS[shop.plan.tier].productSyncCount;
  //     if (shop.productCount >= limit) {
  //       throw new Error("Exceeded count for products for this shop's plan");
  //     }
  //   }
  // }
  await tryIncrProductSyncCount({ record, api, logger });
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
