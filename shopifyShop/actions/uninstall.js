import {
  transitionState,
  // applyParams,
  preventCrossShopDataAccess,
  // save,
  ActionOptions,
  ShopifyShopState,
  UninstallShopifyShopActionContext,
  deleteRecord,
} from 'gadget-server';
import { postShopDeleteResult } from '../../routes/main-backend/utils';

/**
 * @param { UninstallShopifyShopActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  if (!(record.state instanceof Object && record.state['created'] === 'uninstalled')) {
    transitionState(record, { from: ShopifyShopState.Installed, to: ShopifyShopState.Uninstalled });
  }
  // const _CANCEL_SUBSCRIPTION_QUERY = `
  // 	mutation AppSubscriptionCancel($id: ID!) {
  // 		appSubscriptionCancel(id: $id) {
  // 			userErrors {
  // 				field
  // 				message
  // 			}
  // 			appSubscription {
  // 				id
  // 				status
  // 			}
  // 		}
  // 	}
  // `;

  // const shopify = connections.shopify.current;

  // try {
  //   const result = await shopify.graphql(_CANCEL_SUBSCRIPTION_QUERY, {
  //     id: record.subscriptionId,
  //   });
  //   logger.info(result, '[shopifyShop:uninstall] GraphQL Result');
  // } catch (error) {
  //   /**@type { Error } */
  //   const err = error;
  //   logger.error({
  //     name: err.name,
  //     message: err.message,
  //     stack: err.stack,
  //     cause: err.cause
  //   }, '[shopifyShop:uninstall] An error occurred.');
  //   return;
  // }

  // applyParams(params, record);

  const deleteChatbotSettings = async () => {
    try {
      const chatBotSettings = await api.chatbotSettings.findMany({
        where: {
          shopId: record.id,
        },
      });
      await api.chatbotSettings.bulkDelete(chatBotSettings.map((v) => v.id));
    } catch (error) {
      const { name, message, stack, cause } = /**@type { Error } */ (error);
      logger.error(
        { name, message, stack, cause },
        '[shopifyShop:uninstall] An error occurred deleting chatbot Settings'
      );
    }
  };

  const deletePlan = async () => {
    try {
      const plan = await api.plan.findByShop(record.id);
      await api.chatbotSettings.delete(plan.id);
    } catch (error) {
      const { name, message, stack, cause } = /**@type { Error } */ (error);
      logger.error(
        { name, message, stack, cause },
        '[shopifyShop:uninstall] An error occurred deleting plan'
      );
    }
  };

  const deleteProducts = async () => {
    try {
      const products = await api.shopifyProduct.findMany({
        where: {
          shopId: record.id,
        },
      });
      const res = await api.shopifyProduct.bulkDelete(products.map((r) => r.id));
      logger.info(res, '[shopifyShop:uninstall] Deleted Related Products');
    } catch (error) {
      /**@type { Error } */
      const err = error;
      logger.error(
        {
          name: err.name,
          message: err.message,
          stack: err.stack,
          cause: err.cause,
        },
        '[shopifyShop:uninstall] Error occurred deleting related products'
      );
    }
  };
  const deleteProductImages = async () => {
    try {
      const productImages = await api.shopifyProductImage.findMany({
        where: {
          shopId: record.id,
        },
      });
      const res = await api.shopifyProductImage.bulkDelete(productImages.map((r) => r.id));
      logger.info(res, '[shopifyShop:uninstall] Deleted Related ProductImages');
    } catch (error) {
      /**@type { Error } */
      const err = error;
      logger.error(
        {
          name: err.name,
          message: err.message,
          stack: err.stack,
          cause: err.cause,
        },
        '[shopifyShop:uninstall] Error occurred deleting related productImages'
      );
    }
  };
  await Promise.all([
    deleteChatbotSettings(),
    deletePlan(),
    deleteProducts(),
    deleteProductImages(),
  ]);
  await deleteRecord(record);
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
  actionType: 'delete',
};
