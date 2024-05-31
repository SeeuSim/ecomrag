import {
  preventCrossShopDataAccess,
  deleteRecord,
  ActionOptions,
  DeleteShopifyProductActionContext,
} from 'gadget-server';
import { postProductDeleteResult } from '../../../routes/main-backend/utils';

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
  if (record.descriptionEmbedding) {
    const plan = await api.plan.findByShop(record.shopId);
    if (plan) {
      try {
        await api.internal.plan.update(plan.id, {
          _atomics: {
            productSyncCount: {
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
  }
  await postProductDeleteResult(record, logger);
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
  triggers: { api: true },
};
