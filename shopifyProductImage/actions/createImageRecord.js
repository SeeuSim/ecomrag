import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  CreateImageEmbeddingShopifyProductImageActionContext,
} from 'gadget-server';

/**
 * @param { CreateImageEmbeddingShopifyProductImageActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateImageEmbeddingShopifyProductImageActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
};
