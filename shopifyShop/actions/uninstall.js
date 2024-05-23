import {
  transitionState,
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  ShopifyShopState,
  UninstallShopifyShopActionContext,
} from 'gadget-server';
import { postShopDeleteResult } from '../../routes/main-backend/utils';

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  transitionState(record, { from: ShopifyShopState.Installed, to: ShopifyShopState.Uninstalled });
  // logger.info(params, "params");
  logger.info(params, 'alalala');
  // applyParams({ plan: "Free" }, record);

  logger.info('deleting shop');
  logger.info(record.id, 'record id');
  void api.shopifyShop
    .delete(record.id)
    .then(() => {
      console.log('Shop deleted successfully');
    })
    .catch((error) => {
      console.error('Error deleting shop:', error);
    });

  logger.info("hi i'm here");
  logger.info(record, 'record');
  const CANCEL_SUBSCRIPTION_QUERY = `
		mutation AppSubscriptionCancel($id: ID!) {
			appSubscriptionCancel(id: $id) {
				userErrors {
					field
					message
				}
				appSubscription {
					id
					status
				}
			}
		}
	`;

  const shopify = connections.shopify.current;

  // const result = await shopify.graphql(CANCEL_SUBSCRIPTION_QUERY, {
  // 	id: record.subscriptionId,
  // });

  // logger.info(result, 'result');

  await preventCrossShopDataAccess(params, record);
  try {
    await save(record);
    logger.info('Record saved successfully.');
  } catch (error) {
    logger.error('Error saving record:', error);
    // Handle the error appropriately
  }
}

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
  await postShopDeleteResult(record, logger);
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
};
