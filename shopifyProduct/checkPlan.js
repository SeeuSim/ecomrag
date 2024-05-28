import { Client } from '@gadget-client/ecomrag';
import { logger as gadgetLogger, CreateShopifyProductActionContext } from 'gadget-server';
import { PLAN_LIMITS } from '../plan/utils';

/**
 * @typedef { import ('../plan/utils').Plan} Plan
 */

/**
 * @typedef { CreateShopifyProductActionContext. } ShopifyProduct
 */

/** @type { ({ record, api, logger }: { record: ShopifyProduct, api: typeof Client.prototype, logger: typeof gadgetLogger }) => Promise<boolean>} */
export const tryIncrShopSyncCount = async ({ record, api, logger }) => {
  const plan = await api.plan.findByShop(record.shopId);
  const { tier } = /**@type { Plan } */ (plan);
  const limit = PLAN_LIMITS[tier].productSyncCount;
  const withinLimit = plan.productSyncCount < limit;

  // Only proceed if the product count is within the limit
  // only run if the product does not have an embedding, or if the title or body have changed
  //logger.info({ productCount: productSyncCount, productLimit }, 'product count and limit');
  if (
    (withinLimit && !record.descriptionEmbedding) ||
    record.changed('title') ||
    record.changed('body')
  ) {
    try {
      if (withinLimit) {
        await api.internal.plan.update(plan.id, {
          _atomics: {
            productSyncCount: {
              increment: 1,
            },
          },
        });
      }
      return true;
    } catch (error) {
      logger.error({ error }, 'Error incrementing Sync Count');
      return false;
    }
  } else {
    logger.info('Product limit reached for the current plan. Skipping embedding creation.');
    return false;
  }
};
