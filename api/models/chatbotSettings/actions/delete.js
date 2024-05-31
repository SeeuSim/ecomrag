import {
  deleteRecord,
  ActionOptions,
  DeleteChatbotSettingsActionContext,
  preventCrossShopDataAccess,
} from 'gadget-server';

/**
 * @param { DeleteChatbotSettingsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await preventCrossShopDataAccess(params, record);
  await deleteRecord(record);
}

/**
 * @param { DeleteChatbotSettingsActionContext } context
 */
export async function onSuccess({ params, record, logger, api, connections }) {
  // Your logic goes here
}

/** @type { ActionOptions } */
export const options = {
  actionType: 'delete',
  triggers: { api: true },
};
