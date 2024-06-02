import { Client } from '@gadget-client/ecomrag';
import { logger as gadgetLogger } from 'gadget-server';
import { PLAN_LIMITS } from '../plan/utils';

/**
 * @typedef { import ('../plan/utils').Plan} Plan
 */

/**
 * @typedef { Awaited<ReturnType<typeof Client.prototype.shopifyProductImage.findOne>> } ShopifyProductImage
 */

/** @type { ({ record, api, logger, isUpdate }: { record: ShopifyProductImage, api: typeof Client.prototype, logger: typeof gadgetLogger }) => Promise<boolean>} */
export const tryIncrImageSyncCount = async ({ record, api, logger }) => {
  let plan;
  try {
    plan = await api.plan.maybeFindFirst({
      filter: {
        shop: {
          equals: record.shopId,
        },
      },
    });
    if (!plan) {
      logger.error({ shopId: record.shopId }, 'Data migration not present - create a Plan first.');
      return false;
    }
  } catch (error) {
    const { name, message, stack, cause } = /**@type { Error } */ (error);
    logger.error({ shopId: record.shopId }, 'Data migration not present - create a Plan first.');
    logger.error({ name, message, stack, cause }, 'An error occurred.');
    return false;
  }
  const { tier } = /**@type { Plan } */ (plan);
  const limit = PLAN_LIMITS[tier].imageUploadCount;
  const withinLimit = plan.imageUploadCount < limit;

  if (withinLimit) {
    try {
      await api.internal.plan.update(plan.id, {
        _atomics: {
          imageUploadCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      const { name, message, stack, cause } = /**@type { Error } */ (error);
      logger.error({ name, message, stack, cause }, 'Error incrementing Sync Count');
      return false;
    }
    return true;
  }
  logger.info('Product limit reached for the current plan. Skipping shopifyProductImage creation.');
  return false;
};
