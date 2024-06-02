import { ValidatePlanGlobalActionContext } from 'gadget-server';
import { PLAN_LIMITS } from '../models/plan/utils';

const PARAM_KEYS = /**@type {const } */ (['newPlanName', 'shopId']);

/**
 * @typedef { typeof PARAM_KEYS[number] } ValidatePlanParamKeys
 */

/**
 * @typedef { { [k in ValidatePlanParamKeys]: string } } ValidatePlanParams
 */

/**
 * @typedef { import('gadget-server').api } Client
 */
/**
 * @typedef { import('gadget-server').logger } Logger
 */

/**
 *
 * @param { { api: Client, logger: Logger, shopId: string, newPlanTier: import('../models/plan/utils').Plan['tier'] } } context
 */
async function downgradeImages({ api, logger, newPlanTier, shopId }) {
  /**@type { import('@gadget-client/ecomrag').Plan | undefined } */
  let plan;
  try {
    plan = await api.plan.findByShop(shopId);
  } catch (error) {
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      'Problem enforcing plan - no plan record or error finding plan record.'
    );
  } finally {
    if (!plan) {
      return;
    }
  }

  let exceededBy = plan.imageUploadCount ?? 0 - PLAN_LIMITS[newPlanTier].imageUploadCount;
  if (exceededBy <= 0) {
    return;
  }

  let imagePage = await api.shopifyProductImage.findMany({
    filter: {
      imageDescriptionEmbedding: {
        isSet: true,
      },
      shop: {
        equals: shopId,
      },
    },
  });
  let imagesToUpdate = imagePage.length;
  let errors = [];

  const clearImageEmbeddings = async () => {
    if (!imagePage || imagePage.length === 0) {
      return;
    }
    try {
      const updatedLength = exceededBy < 0 ? imagePage.length + exceededBy : imagePage.length;
      if (updatedLength <= 0) {
        return;
      }
      await Promise.all(
        imagePage.slice(0, updatedLength).map((v) => api.internal.shopifyProductImage.delete(v.id))
      );
      await api.internal.plan.update(plan.id, {
        _atomics: {
          imageUploadCount: {
            decrement: updatedLength,
          },
        },
      });
    } catch (error) {
      errors.push(error);
    }
  };

  while (imagePage.hasNextPage && exceededBy > 0) {
    await clearImageEmbeddings();
    imagePage = await imagePage.nextPage();
    imagesToUpdate -= imagePage.length;
  }
  await clearImageEmbeddings();
  if (errors) {
    errors.forEach((err) => {
      logger.error(
        { name: err.name, message: err.message, stack: err.stack, cause: err.cause },
        'An error occurred downgrading images to quota'
      );
    });
  }
}

/**
 *
 * @param { { api: Client, logger: Logger, shopId: string, newPlanTier: import('../models/plan/utils').Plan['tier'] } } context
 */
async function downgradeProducts({ api, logger, newPlanTier, shopId }) {
  /**@type { import('@gadget-client/ecomrag').Plan} */
  let plan;
  try {
    plan = await api.plan.findByShop(shopId);
  } catch (error) {
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      'Problem enforcing plan - no plan record or error finding plan record.'
    );
  } finally {
    if (!plan) {
      return;
    }
  }

  let exceededBy = plan.productSyncCount ?? 0 - PLAN_LIMITS[newPlanTier].productSyncCount;
  if (exceededBy <= 0) {
    return;
  }

  let productPage = await api.shopifyProduct.findMany({
    filter: {
      shop: {
        equals: shopId,
      },
    },
  });
  let productsToUpdate = productPage.length;
  let errors = [];

  const clearProductEmbeddings = async () => {
    if (!productPage || productPage.length === 0) {
      return;
    }
    try {
      let updatedLength = exceededBy < 0 ? productPage.length + exceededBy : productPage.length;
      if (updatedLength <= 0) {
        return;
      }
      await Promise.all(
        productPage
          .slice(0, exceededBy < 0 ? productPage.length + exceededBy : productPage.length)
          .map((v) => api.internal.shopifyProduct.delete(v.id))
      );
      await api.internal.plan.update(plan.id, {
        _atomics: {
          productSyncCount: {
            decrement: updatedLength,
          },
        },
      });
    } catch (error) {
      errors.push(error);
    }
  };

  while (productPage.hasNextPage && exceededBy > 0) {
    await clearProductEmbeddings();
    productPage = await productPage.nextPage();
    productsToUpdate -= productPage.length;
  }
  await clearProductEmbeddings();
  if (errors) {
    errors.forEach((err) => {
      logger.error(
        { name: err.name, message: err.message, stack: err.stack, cause: err.cause },
        'An error occurred downgrading products to quota'
      );
    });
  }
}

/**
 * Performs these actions in the prescribed sequence:
 *
 * 1. Updates the Plan field on shopifyShop for the frontend to display.
 *
 * 2. Attempts to enforce limits on the shop's records
 *
 * 3. Should all be successful, sets the plan counter record to the new tier.
 *
 * @param { ValidatePlanGlobalActionContext } context
 */
export async function run({ params, logger: gadgetLogger, api: gadgetApi, connections }) {
  const api = /**@type { Client } */ (gadgetApi);
  const logger = /**@type { Logger } */ (gadgetLogger);
  const { newPlanName, shopId } = /** @type { Partial<ValidatePlanParams> } */ (params);
  if (!newPlanName || !shopId) {
    return;
  }

  let existingPlanRecord;
  try {
    existingPlanRecord = await api.plan.maybeFindFirst({
      filter: {
        shop: {
          equals: shopId,
        },
      },
    });
  } catch (error) {
    logger.error(
      { name: error.name, message: error.message, stack: error.stack, cause: error.cause, shopId },
      'Error finding plan to validate'
    );
    return;
  }

  const newPlanTier = /** @type { import('../models/plan/utils').Plan['tier']} */ (
    newPlanName.replace(/^\w/, (c) => c.toUpperCase())
  );

  try {
    // For FE Display
    await api.plan.update(existingPlanRecord.id, {
      tier: newPlanTier,
    });
  } catch (error) {
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      'An error occurred setting the shop plan'
    );
  }
  if (!existingPlanRecord?.tier) {
    return;
  }

  const { tier: oldTier } = existingPlanRecord;
  let isUpgrade = false;
  if (newPlanTier === oldTier) {
    return;
  }

  switch (oldTier) {
    case 'Free':
      if (newPlanTier !== 'Free') {
        isUpgrade = true;
      }
      break;
    case 'Growth':
      if (['Premium', 'Enterprise'].includes(newPlanTier)) {
        isUpgrade = true;
      }
      break;
    case 'Premium':
      if (newPlanTier === 'Enterprise') {
        isUpgrade = true;
      }
      break;
    default: // Enterprise -> lower tier
      break;
  }

  if (isUpgrade) {
    logger.info({}, 'Upgrade - running sync');
    try {
      await api.shopifySync.run({
        domain: shopRecord.domain,
        shop: {
          _link: shopId,
        },
        models: [
          'shopifyProduct',
          'shopifyProductImage',
          // "shopifyOrder",
          // "shopifyOrderLineItem",
        ],
      });
    } catch (error) {
      logger.error(
        { name: error.name, message: error.message, stack: error.stack },
        'Problem running upgrade sync'
      );
    }
  } else {
    logger.info({}, 'Downgrade - removing excessive resources');
    await Promise.all([
      downgradeImages({ api, logger, newPlanTier, shopId }),
      downgradeProducts({ api, logger, newPlanTier, shopId }),
    ]);
  }
}

/**
 * @type { { [k in ValidatePlanParamKeys]: { type: string, required: boolean }}}
 */
export const params = {
  newPlanName: {
    type: 'string',
    required: true,
  },
  shopId: {
    type: 'string',
    required: true,
  },
};
