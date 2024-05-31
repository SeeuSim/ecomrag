import {
  ActionOptions,
  UpdateShopifyProductImageActionContext,
  applyParams,
  preventCrossShopDataAccess,
  save,
} from 'gadget-server';
import { postProductImageUpdateResult } from '../../../routes/main-backend/utils';
import { tryIncrImageSyncCount } from '../checkPlan';
import { postProductImgEmbedCaption } from '../postSqs';

/**
 * @param { UpdateShopifyProductImageActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);
  await save(record);
}

/**
 * @param { UpdateShopifyProductImageActionContext } context
 */
export async function onSuccess({ record, logger, api, params: _p, connections: _c }) {
  const isCaptionEmbed = {
    Embed: !record.getField('imageDescriptionEmbedding') || record.changed('source'),
    Caption: !record.getField('imageDescription') || record.changed('source'),
  };
  if (
    tryIncrImageSyncCount({
      record,
      api,
      logger,
      isUpdate: isCaptionEmbed.Caption || isCaptionEmbed.Embed,
    })
  ) {
    await postProductImgEmbedCaption(
      { Id: record.id, Source: record.source },
      isCaptionEmbed,
      record.shopId ?? 'DUMMYMSGGRPID',
      logger
    );
  } else {
    logger.info(
      { isCaptionEmbed, sourceChanged: record.changed('source') },
      `Failed check for productImg | update`
    );
  }
  logger.info(record, 'Triggering productImage update onSuccess');
  await postProductImageUpdateResult(record, logger);
}

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: true },
};