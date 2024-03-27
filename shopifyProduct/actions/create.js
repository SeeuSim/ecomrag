import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyProductActionContext,
} from 'gadget-server';
import { createProductEmbedding } from '../createEmbedding';

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
  // TODO: post to SQS topic if embedding not set
  // await createProductEmbedding({ params, record, api, logger, connections });
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
