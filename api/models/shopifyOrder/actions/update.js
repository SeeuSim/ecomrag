import { applyParams, save, ActionOptions, UpdateShopifyOrderActionContext } from 'gadget-server';

/**
 * @param { UpdateShopifyOrderActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Assuming 'OrderStatus' is your custom model for tracking order statuses
  const OrderStatus = api.orderStatus;

  try {
    // Check if an order status record already exists for this order
    const existingStatus = await OrderStatus.findBy({ orderId: record.id });

    // If it exists, update the status
    if (existingStatus) {
      await existingStatus.update({ status: record.financial_status });
    } else {
      // If it doesn't exist, create a new status record
      await OrderStatus.create({
        orderId: record.id,
        status: record.financial_status,
      });
    }

    logger.info(`Order status updated for order ${record.id}`);
  } catch (error) {
    logger.error('Error updating order status:', error);
    throw error;
  }
}

export const options = { triggers: { api: false } }