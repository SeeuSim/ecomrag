import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  UpdateShopifyProductActionContext,
} from 'gadget-server';
import { createProductEmbedding } from '../createEmbedding';

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
  // TODO: Post to SQS topic if embedding not set
  // await createProductEmbedding({ params, record, api, logger, connections });
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
};
