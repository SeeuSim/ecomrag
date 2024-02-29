import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateShopifyProductImageActionContext,
} from 'gadget-server';
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
  await createProductImageEmbedding({ record, api, logger, connections });
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
