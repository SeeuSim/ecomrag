import { deleteRecord, ActionOptions, DeleteChatLogActionContext } from 'gadget-server';

/**
 * @param { DeleteChatLogActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
}

/**
 * @param { DeleteChatLogActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
  triggers: { api: true },
};
