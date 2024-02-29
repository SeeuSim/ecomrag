import {
  applyParams,
  save,
  ActionOptions,
  CreateRecommendedProductActionContext,
} from 'gadget-server';

/**
 * @param { CreateRecommendedProductActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { CreateRecommendedProductActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
