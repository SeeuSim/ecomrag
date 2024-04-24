import {
  preventCrossShopDataAccess,
  deleteRecord,
  ActionOptions,
  DeleteShopifyProductImageActionContext,
} from 'gadget-server';
import { postProductImageDeleteResult } from '../../routes/main-backend/utils';

/**
 * @param { DeleteShopifyProductImageActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
}

/**
 * @param { DeleteShopifyProductImageActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
  await postProductImageDeleteResult(record, logger);
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'delete',
};
