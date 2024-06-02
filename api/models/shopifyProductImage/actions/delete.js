import {
  preventCrossShopDataAccess,
  deleteRecord,
  ActionOptions,
  DeleteShopifyProductImageActionContext,
} from 'gadget-server';
import { postProductImageDeleteResult } from '../../../routes/main-backend/utils';

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
  const plan = await api.plan.findByShop(record.shopId);
  if (plan && record.imageDescriptionEmbedding) {
    try {
      await api.internal.plan.update(plan.id, {
        _atomics: {
          imageUploadCount: {
            decrement: 1,
          },
        },
      });
    } catch (error) {
      const { name, message, stack, cause } = /**@type { Error } */ (error);
      logger.error(
        { name, message, stack, cause },
        'Validation error occurred - plan usage reached minimum or was deleted while this operation was in progress'
      );
    }
  }
  await postProductImageDeleteResult(record, logger);
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'delete',
  triggers: { api: true },
};
