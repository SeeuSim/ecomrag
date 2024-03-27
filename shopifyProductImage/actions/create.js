import { applyParams, preventCrossShopDataAccess, save } from 'gadget-server';
import { createProductImageEmbedding } from '../createImageEmbedding';

/**
 * @param { CreateShopifyProductImageActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyProductImageActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // TODO: Post to SQS topic if embedding/caption not set
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
