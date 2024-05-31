import {
  ActionOptions,
  UpdateShopifyShopActionContext,
  applyParams,
  preventCrossShopDataAccess,
  save,
} from 'gadget-server';
import { postShopUpdateResult } from '../../../routes/main-backend/utils';

/**
 * @param { UpdateShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { UpdateShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
  await postShopUpdateResult(record, logger);
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
  triggers: { api: true },
};
