import { applyParams, preventCrossShopDataAccess, save } from 'gadget-server';
import { createProductImageEmbedding } from '../createImageEmbedding';
import { postProductImgEmbedCaption } from '../postSqs';
import { tryIncrShopSyncCount } from '../checkPlan';

/**
 * @param { CreateShopifyProductImageActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { CreateShopifyProductImageActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  if (
    record.source &&
    record.source.length > 0 &&
    tryIncrShopSyncCount({ params, record, logger, api, connections })
  ) {
    postProductImgEmbedCaption(
      { Id: record.id, Source: record.source },
      { Caption: true, Embed: true },
      logger
    );
  }
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
