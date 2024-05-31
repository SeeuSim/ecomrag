import {
  applyParams,
  save,
  ActionOptions,
  CreateImageRecommendedProductActionContext,
} from 'gadget-server';

/**
 * @param { CreateImageRecommendedProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { CreateImageRecommendedProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
  triggers: { api: true },
};
