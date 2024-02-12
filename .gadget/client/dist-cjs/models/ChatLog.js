"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ChatLog_exports = {};
__export(ChatLog_exports, {
  ChatLogManager: () => ChatLogManager,
  DefaultChatLogSelection: () => DefaultChatLogSelection
});
module.exports = __toCommonJS(ChatLog_exports);
var import_api_client_core = require("@gadgetinc/api-client-core");
var import_support = require("../support.js");
const DefaultChatLogSelection = {
  "__typename": true,
  "createdAt": true,
  "id": true,
  "response": true,
  "updatedAt": true
};
;
;
;
;
;
;
;
;
const apiIdentifier = "chatLog";
const pluralApiIdentifier = "chatLogs";
async function createChatLog(variables, options) {
  const newVariables = (0, import_support.disambiguateActionParams)(
    this["create"],
    void 0,
    variables
  );
  return await (0, import_api_client_core.actionRunner)(
    this,
    "createChatLog",
    DefaultChatLogSelection,
    apiIdentifier,
    apiIdentifier,
    false,
    {
      "chatLog": {
        value: newVariables.chatLog,
        required: false,
        type: "CreateChatLogInput"
      }
    },
    options,
    null,
    false
  );
}
async function updateChatLog(id, variables, options) {
  const newVariables = (0, import_support.disambiguateActionParams)(
    this["update"],
    id,
    variables
  );
  return await (0, import_api_client_core.actionRunner)(
    this,
    "updateChatLog",
    DefaultChatLogSelection,
    apiIdentifier,
    apiIdentifier,
    false,
    {
      id: {
        value: id,
        required: true,
        type: "GadgetID"
      },
      "chatLog": {
        value: newVariables.chatLog,
        required: false,
        type: "UpdateChatLogInput"
      }
    },
    options,
    null,
    false
  );
}
async function deleteChatLog(id, options) {
  return await (0, import_api_client_core.actionRunner)(
    this,
    "deleteChatLog",
    null,
    apiIdentifier,
    apiIdentifier,
    false,
    {
      id: {
        value: id,
        required: true,
        type: "GadgetID"
      }
    },
    options,
    null,
    false
  );
}
class ChatLogManager {
  constructor(connection) {
    this.connection = connection;
    /**
    * Finds one chatLog by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
    **/
    this.findOne = Object.assign(
      async (id, options) => {
        return await (0, import_api_client_core.findOneRunner)(
          this,
          "chatLog",
          id,
          DefaultChatLogSelection,
          apiIdentifier,
          options
        );
      },
      {
        type: "findOne",
        findByVariableName: "id",
        operationName: "chatLog",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultChatLogSelection
      }
    );
    /**
    * Finds one chatLog by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
    **/
    this.maybeFindOne = Object.assign(
      async (id, options) => {
        const record = await (0, import_api_client_core.findOneRunner)(
          this,
          "chatLog",
          id,
          DefaultChatLogSelection,
          apiIdentifier,
          options,
          false
        );
        return record.isEmpty() ? null : record;
      },
      {
        type: "maybeFindOne",
        findByVariableName: "id",
        operationName: "chatLog",
        modelApiIdentifier: "chatLog",
        defaultSelection: DefaultChatLogSelection
      }
    );
    /**
    * Finds many chatLog. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
    **/
    this.findMany = Object.assign(
      async (options) => {
        return await (0, import_api_client_core.findManyRunner)(
          this,
          "chatLogs",
          DefaultChatLogSelection,
          "chatLog",
          options
        );
      },
      {
        type: "findMany",
        operationName: "chatLogs",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultChatLogSelection
      }
    );
    /**
    * Finds the first matching chatLog. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
    **/
    this.findFirst = Object.assign(
      async (options) => {
        const list = await (0, import_api_client_core.findManyRunner)(
          this,
          "chatLogs",
          DefaultChatLogSelection,
          apiIdentifier,
          { ...options, first: 1, last: void 0, before: void 0, after: void 0 },
          true
        );
        return list[0];
      },
      {
        type: "findFirst",
        operationName: "chatLogs",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultChatLogSelection
      }
    );
    /**
    * Finds the first matching chatLog. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
    **/
    this.maybeFindFirst = Object.assign(
      async (options) => {
        const list = await (0, import_api_client_core.findManyRunner)(
          this,
          "chatLogs",
          DefaultChatLogSelection,
          apiIdentifier,
          { ...options, first: 1, last: void 0, before: void 0, after: void 0 },
          false
        );
        return (list == null ? void 0 : list[0]) ?? null;
      },
      {
        type: "maybeFindFirst",
        operationName: "chatLogs",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultChatLogSelection
      }
    );
    /**
    * Finds one chatLog by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
    **/
    this.findById = Object.assign(
      async (value, options) => {
        return await (0, import_api_client_core.findOneByFieldRunner)(
          this,
          "chatLogs",
          "id",
          value,
          DefaultChatLogSelection,
          apiIdentifier,
          options
        );
      },
      {
        type: "findOne",
        findByVariableName: "id",
        operationName: "chatLogs",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultChatLogSelection
      }
    );
    this.create = Object.assign(
      createChatLog,
      {
        type: "action",
        operationName: "createChatLog",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: apiIdentifier,
        isBulk: false,
        defaultSelection: DefaultChatLogSelection,
        variables: {
          "chatLog": {
            required: false,
            type: "CreateChatLogInput"
          }
        },
        hasAmbiguousIdentifier: false,
        /** @deprecated -- effects are dead, long live AAC */
        hasCreateOrUpdateEffect: true,
        paramOnlyVariables: [],
        hasReturnType: false,
        acceptsModelInput: true
      }
    );
    /**
    * Executes the bulkCreate action with the given inputs.
    */
    this.bulkCreate = Object.assign(
      async (inputs, options) => {
        const fullyQualifiedInputs = inputs.map(
          (input) => (0, import_support.disambiguateActionParams)(
            this["create"],
            void 0,
            input
          )
        );
        return await (0, import_api_client_core.actionRunner)(
          this,
          "bulkCreateChatLogs",
          DefaultChatLogSelection,
          "chatLog",
          "chatLogs",
          true,
          {
            inputs: {
              value: fullyQualifiedInputs,
              ...this["bulkCreate"].variables["inputs"]
            }
          },
          options,
          null,
          false
        );
      },
      {
        type: "action",
        operationName: "bulkCreateChatLogs",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: "chatLogs",
        isBulk: true,
        defaultSelection: DefaultChatLogSelection,
        variables: {
          inputs: {
            required: true,
            type: "[BulkCreateChatLogsInput!]"
          }
        },
        hasReturnType: false,
        acceptsModelInput: true
      }
    );
    this.update = Object.assign(
      updateChatLog,
      {
        type: "action",
        operationName: "updateChatLog",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: apiIdentifier,
        isBulk: false,
        defaultSelection: DefaultChatLogSelection,
        variables: {
          id: {
            required: true,
            type: "GadgetID"
          },
          "chatLog": {
            required: false,
            type: "UpdateChatLogInput"
          }
        },
        hasAmbiguousIdentifier: false,
        /** @deprecated -- effects are dead, long live AAC */
        hasCreateOrUpdateEffect: true,
        paramOnlyVariables: [],
        hasReturnType: false,
        acceptsModelInput: true
      }
    );
    /**
    * Executes the bulkUpdate action with the given inputs.
    */
    this.bulkUpdate = Object.assign(
      async (inputs, options) => {
        const fullyQualifiedInputs = inputs.map(
          (input) => (0, import_support.disambiguateActionParams)(
            this["update"],
            void 0,
            input
          )
        );
        return await (0, import_api_client_core.actionRunner)(
          this,
          "bulkUpdateChatLogs",
          DefaultChatLogSelection,
          "chatLog",
          "chatLogs",
          true,
          {
            inputs: {
              value: fullyQualifiedInputs,
              ...this["bulkUpdate"].variables["inputs"]
            }
          },
          options,
          null,
          false
        );
      },
      {
        type: "action",
        operationName: "bulkUpdateChatLogs",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: "chatLogs",
        isBulk: true,
        defaultSelection: DefaultChatLogSelection,
        variables: {
          inputs: {
            required: true,
            type: "[BulkUpdateChatLogsInput!]"
          }
        },
        hasReturnType: false,
        acceptsModelInput: true
      }
    );
    this.delete = Object.assign(
      deleteChatLog,
      {
        type: "action",
        operationName: "deleteChatLog",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: apiIdentifier,
        isBulk: false,
        defaultSelection: null,
        variables: {
          id: {
            required: true,
            type: "GadgetID"
          }
        },
        hasAmbiguousIdentifier: false,
        /** @deprecated -- effects are dead, long live AAC */
        hasCreateOrUpdateEffect: false,
        paramOnlyVariables: [],
        hasReturnType: false,
        acceptsModelInput: false
      }
    );
    /**
    * Executes the bulkDelete action with the given inputs. Deletes the records on the server.
    */
    this.bulkDelete = Object.assign(
      async (ids, options) => {
        return await (0, import_api_client_core.actionRunner)(
          this,
          "bulkDeleteChatLogs",
          null,
          "chatLog",
          "chatLogs",
          true,
          {
            ids: {
              value: ids,
              ...this["bulkDelete"].variables["ids"]
            }
          },
          options,
          null,
          false
        );
      },
      {
        type: "action",
        operationName: "bulkDeleteChatLogs",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: "chatLogs",
        isBulk: true,
        defaultSelection: null,
        variables: {
          ids: {
            required: true,
            type: "[GadgetID!]"
          }
        },
        hasReturnType: false,
        acceptsModelInput: false
      }
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChatLogManager,
  DefaultChatLogSelection
});
//# sourceMappingURL=ChatLog.js.map
