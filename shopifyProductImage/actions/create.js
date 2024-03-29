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
  // Both payloads are the same.
  // TODO: Post to SQS Queue for IMAGE EMBEDDING if embedding not set
  // TODO: Post to SQS Queue for IMAGE CAPTION if caption not set
  /**@type {{ Id: { DataType: 'String', StringValue: string }, Model: { DataType: 'String', StringValue: string }, Source: { DataType: 'String', StringValue: string }}} */
  const payload = {};
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
