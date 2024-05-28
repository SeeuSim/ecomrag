import { Client } from '@gadget-client/ecomrag';
import { logger as gadgetLogger } from 'gadget-server';
import { PLAN_LIMITS } from '../plan/utils';

/**
 * @typedef { import ('../plan/utils').Plan} Plan
 */

/**
 * @typedef { Awaited<ReturnType<typeof Client.prototype.shopifyProductImage.findOne>> } ShopifyProductImage
 */

/** @type { ({ record, api, logger, isUpdate }: { record: ShopifyProductImage, api: typeof Client.prototype, logger: typeof gadgetLogger, isUpdate?: boolean }) => Promise<boolean>} */
export const tryIncrImageSyncCount = async ({ record, api, logger, isUpdate }) => {
  const plan = await api.plan.findByShop(record.shopId);
  const { tier } = /**@type { Plan } */ (plan);
  const limit = PLAN_LIMITS[tier].imageUploadCount;
  const withinLimit = plan.imageUploadCount < limit;

  if (withinLimit || isUpdate) {
    try {
      if (withinLimit) {
        await api.internal.plan.update(plan.id, {
          _atomics: {
            imageUploadCount: {
              increment: 0.5,
            },
          },
        });
      }
      return true;
    } catch (error) {
      const { name, message, stack, cause } = /**@type { Error } */ (error);
      logger.error({ name, message, stack, cause }, 'Error incrementing Sync Count');
      return false;
    }
  } else {
    if (!withinLimit) {
      logger.info('Product limit reached for the current plan. Skipping embedding creation.');
    }
    return false;
  }
};
