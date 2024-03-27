import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  UpdateShopifyProductImageActionContext,
} from 'gadget-server';
import { createProductImageEmbedding } from '../createImageEmbedding';

/**
 * @param { UpdateShopifyProductImageActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { UpdateShopifyProductImageActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // await createProductImageEmbedding({ record, api, logger, connections });
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
};
