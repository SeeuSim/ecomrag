import {
  actionRunner,
  findManyRunner,
  findOneRunner,
  findOneByFieldRunner
} from "@gadgetinc/api-client-core";
import { disambiguateActionParams } from "../support.js";
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
  const newVariables = disambiguateActionParams(
    this["create"],
    void 0,
    variables
  );
  return await actionRunner(
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
  const newVariables = disambiguateActionParams(
    this["update"],
    id,
    variables
  );
  return await actionRunner(
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
  return await actionRunner(
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
        return await findOneRunner(
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
        const record = await findOneRunner(
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
        return await findManyRunner(
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
        const list = await findManyRunner(
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
        const list = await findManyRunner(
          this,
          "chatLogs",
          DefaultChatLogSelection,
          apiIdentifier,
          { ...options, first: 1, last: void 0, before: void 0, after: void 0 },
          false
        );
        return list?.[0] ?? null;
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
        return await findOneByFieldRunner(
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
          (input) => disambiguateActionParams(
            this["create"],
            void 0,
            input
          )
        );
        return await actionRunner(
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
          (input) => disambiguateActionParams(
            this["update"],
            void 0,
            input
          )
        );
        return await actionRunner(
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
        return await actionRunner(
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
export {
  ChatLogManager,
  DefaultChatLogSelection
};
//# sourceMappingURL=ChatLog.js.map
