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
  // TODO: Post to SQS Queue for TEXT EMBEDDING if embedding not set
  // await createProductEmbedding({ params, record, api, logger, connections });
  /**@type {{ Id: { DataType: 'String', StringValue: string }, Model: { DataType: 'String', StringValue: string }, Description: { DataType: 'String', StringValue: string }}} */
  const payload = {};
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
