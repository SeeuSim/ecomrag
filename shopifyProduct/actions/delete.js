import {
  preventCrossShopDataAccess,
  deleteRecord,
  ActionOptions,
  DeleteShopifyProductActionContext,
} from 'gadget-server';
import { postProductDeleteResult } from '../../routes/main-backend/utils';

/**
 * @param { DeleteShopifyProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
}

/**
 * @param { DeleteShopifyProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
  await postProductDeleteResult(record, logger);
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'delete',
};
