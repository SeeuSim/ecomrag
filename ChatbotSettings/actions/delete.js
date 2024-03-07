import { deleteRecord, ActionOptions, DeleteChatbotSettingsActionContext } from "gadget-server";

/**
 * @param { DeleteChatbotSettingsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/**
 * @param { DeleteChatbotSettingsActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete"
};
