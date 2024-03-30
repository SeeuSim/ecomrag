import {
  CreateShopifyProductImageActionContext,
  applyParams,
  preventCrossShopDataAccess,
  save,
} from 'gadget-server';
import { tryIncrShopSyncCount } from '../checkPlan';
import { postProductImgEmbedCaption } from '../postSqs';

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
  return;
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
