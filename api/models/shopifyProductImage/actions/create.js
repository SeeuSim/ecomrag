import {
  CreateShopifyProductImageActionContext,
  applyParams,
  preventCrossShopDataAccess,
  save,
} from 'gadget-server';
import { postProductImageCreateResult } from '../../../routes/main-backend/utils';
import { IMAGE_PER_PRODUCT } from '../../plan/utils';
import { postProductImgEmbedCaption } from '../postSqs';
import { tryIncrImageSyncCount } from '../checkPlan';

/**
 * @param { CreateShopifyProductImageActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  const [imageCount, plan] = await Promise.all([
    api.shopifyProduct
      .findOne(record.productId, {
        select: {
          imageCount: true,
        },
      })
      .then((res) => res.imageCount),
    api.plan.maybeFindFirst({
      filter: {
        shop: {
          equals: record.shopId,
        },
      },
    }),
  ]);
  if (imageCount >= IMAGE_PER_PRODUCT && plan.tier !== 'Enterprise') {
    logger.error('Exceeded plan limit for this product. Skipping image creation.');
    return;
  }
  const shop = await api.shopifyShop.maybeFindFirst({
    filter: {
      id: {
        equals: record.shopId,
      },
    },
    select: {
      imageCount: true,
      plan: {
        tier: true,
      },
    },
  });
  if (shop) {
    if (shop.plan?.tier) {
      const limit = PLAN_LIMITS[shop.plan.tier].imageUploadCount;
      if (Number.parseInt(shop.imageCount) >= limit) {
        return;
      }
    }
  }
  await tryIncrImageSyncCount({ record, api, logger });
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyProductImageActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  const isSrcValid = !!record.source && record.source.length > 0;
  if (isSrcValid) {
    await postProductImgEmbedCaption(
      { Id: record.id, Source: record.source },
      { Caption: true, Embed: true },
      record.shopId ?? 'DUMMYMSGID',
      logger
    );
  } else {
    logger.info(
      { source: record.source },
      `Invalid source for shopifyProductImage. Skipping embedding`
    );
  }
  await postProductImageCreateResult(record, logger);
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
  triggers: { api: true },
};
