import {
  CreateShopifyProductImageActionContext,
  applyParams,
  preventCrossShopDataAccess,
  save,
} from 'gadget-server';
import { tryIncrShopSyncCount } from '../checkPlan';
import { postProductImgEmbedCaption } from '../postSqs';
import { postProductImageCreateResult } from '../../routes/main-backend/utils';

/**
 * @param { CreateShopifyProductImageActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
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
  if (imageCount >= 2 && plan.tier !== 'Enterprise') {
    logger.error('Exceeded plan limit for this product. Skipping image creation.');
    return;
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
    tryIncrShopSyncCount({ params, record, logger, api, connections })
  ) {
    await postProductImgEmbedCaption(
      { Id: record.id, Source: record.source },
      { Caption: true, Embed: true },
      record.shopId ?? 'DUMMYMSGID',
      logger
    );
  } else {
    logger.info(`${record.source} | ${!!record.source} | Failed check for productImg | create`);
  }
  await postProductImageCreateResult(record, logger);
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
