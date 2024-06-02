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
import { postShopDeleteResult } from '../../../routes/main-backend/utils';

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
      if (chatBotSettings) {
        await api.chatbotSettings.bulkDelete(chatBotSettings.map((v) => v.id));
      }
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
      const plan = await api.plan.maybeFindFirst({
        filter: {
          shop: {
            equals: record.id,
          },
        },
      });
      if (plan) {
        await api.plan.delete(plan.id);
      }
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
      if (products) {
        const res = await api.shopifyProduct.bulkDelete(products.map((r) => r.id));
        logger.info(res, '[shopifyShop:uninstall] Deleted Related Products');
      }
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
      if (productImages) {
        const res = await api.shopifyProductImage.bulkDelete(productImages.map((r) => r.id));
        logger.info(res, '[shopifyShop:uninstall] Deleted Related ProductImages');
      }
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

  const deleteTimeSeries = async () => {
    let timeSeries = await api.analyticsTimeSeries.findMany({
      filter: {
        shop: {
          equals: record.id,
        },
      },
    });
    const deleteTimeSeries = async () => {
      for (const ts of timeSeries) {
        let productEntries = await api.analyticsProductEntry.findMany({
          filter: {
            timeseries: {
              equals: ts.id,
            },
          },
        });
        const deleteProductEntries = async () => {
          await api.analyticsProductEntry.bulkDelete(productEntries.map((v) => v.id));
        };
        while (productEntries.hasNextPage) {
          let temp = await productEntries.nextPage();
          await deleteProductEntries();
          productEntries = temp;
        }
        await deleteProductEntries();
        await api.analyticsTimeSeries.delete(ts.id);
      }
    };
    while (timeSeries.hasNextPage) {
      let temp = await timeSeries.nextPage();
      await deleteTimeSeries();
      timeSeries = temp;
    }
    await deleteTimeSeries();
  };

  await Promise.all([
    deleteChatbotSettings(),
    deletePlan(),
    deleteTimeSeries(),
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
  triggers: { api: true },
};
