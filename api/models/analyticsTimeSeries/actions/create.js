import {
  applyParams,
  save,
  ActionOptions,
  CreateAnalyticsTimeSeriesActionContext,
} from 'gadget-server';

/**
 * @param { CreateAnalyticsTimeSeriesActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { CreateAnalyticsTimeSeriesActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'create',
};
