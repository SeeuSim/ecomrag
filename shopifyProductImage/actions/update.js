import {
  applyParams,
  preventCrossShopDataAccess,
  save,
  ActionOptions,
  UpdateShopifyProductImageActionContext,
} from 'gadget-server';
import { postProductImgEmbedCaption } from '../postSqs';
import { tryIncrShopSyncCount } from '../checkPlan';

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
export async function onSuccess({ params, record, logger, api, connections }) {
  const isCaptionEmbed = {
    Embed: !record.getField('imageDescriptionEmbedding') || record.changed('source'),
    Caption: !record.getField('imageDescription') || record.changed('source'),
  };
  if (
    tryIncrShopSyncCount({ params, record, api, logger, connections }) &&
    (isCaptionEmbed.Caption || isCaptionEmbed.Embed)
  ) {
    postProductImgEmbedCaption({ Id: record.id, Source: record.source }, isCaptionEmbed, logger);
  }
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
};
