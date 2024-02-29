import { applyParams, save, ActionOptions, UpdateChatLogActionContext } from 'gadget-server';

/**
 * @param { UpdateChatLogActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
}

/**
 * @param { UpdateChatLogActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'update',
};
