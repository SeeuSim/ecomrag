import {
  CreateShopifyProductImageActionContext,
  applyParams,
  preventCrossShopDataAccess,
  save,
} from 'gadget-server';
import { IMAGE_PER_PRODUCT } from '../../plan/utils';
import { postProductImageCreateResult } from '../../../routes/main-backend/utils';
import { tryIncrImageSyncCount } from '../checkPlan';
import { postProductImgEmbedCaption } from '../postSqs';

// TODO: Test in dev and increase count if needed
const VALIDATE = process.env.NODE_ENV === 'development';

/**
 * @param { CreateShopifyProductImageActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  if (VALIDATE) {
    const [imageCount, plan] = await Promise.all([
      api.shopifyProduct
        .findOne(record.productId, {
          select: {
            imageCount: true,
          },
        })
        .then((res) => res.imageCount),
      api.plan.findByShop(record.shopId),
    ]);
    if (imageCount >= IMAGE_PER_PRODUCT && plan.tier !== 'Enterprise') {
      logger.error('Exceeded plan limit for this product. Skipping image creation.');
      return;
    }
  }
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyProductImageActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  if (
    !!record.source &&
    record.source.length > 0 &&
    tryIncrImageSyncCount({ params, record, logger, api, connections })
  ) {
    await postProductImgEmbedCaption(
      { Id: record.id, Source: record.source },
      { Caption: true, Embed: true },
      record.shopId ?? 'DUMMYMSGID',
      logger
    );
  } else {
    logger.info({ source: record.source }, `Invalid source for product Image. Skipping embedding`);
  }
  await postProductImageCreateResult(record, logger);
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
  triggers: { api: true },
};
