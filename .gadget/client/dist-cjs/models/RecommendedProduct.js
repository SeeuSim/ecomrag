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
var RecommendedProduct_exports = {};
__export(RecommendedProduct_exports, {
  DefaultRecommendedProductSelection: () => DefaultRecommendedProductSelection,
  RecommendedProductManager: () => RecommendedProductManager
});
module.exports = __toCommonJS(RecommendedProduct_exports);
var import_api_client_core = require("@gadgetinc/api-client-core");
var import_support = require("../support.js");
const DefaultRecommendedProductSelection = {
  "__typename": true,
  "createdAt": true,
  "id": true,
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
const apiIdentifier = "recommendedProduct";
const pluralApiIdentifier = "recommendedProducts";
async function createRecommendedProduct(variables, options) {
  const newVariables = (0, import_support.disambiguateActionParams)(
    this["create"],
    void 0,
    variables
  );
  return await (0, import_api_client_core.actionRunner)(
    this,
    "createRecommendedProduct",
    DefaultRecommendedProductSelection,
    apiIdentifier,
    apiIdentifier,
    false,
    {
      "recommendedProduct": {
        value: newVariables.recommendedProduct,
        required: false,
        type: "CreateRecommendedProductInput"
      }
    },
    options,
    null,
    false
  );
}
async function updateRecommendedProduct(id, variables, options) {
  const newVariables = (0, import_support.disambiguateActionParams)(
    this["update"],
    id,
    variables
  );
  return await (0, import_api_client_core.actionRunner)(
    this,
    "updateRecommendedProduct",
    DefaultRecommendedProductSelection,
    apiIdentifier,
    apiIdentifier,
    false,
    {
      id: {
        value: id,
        required: true,
        type: "GadgetID"
      },
      "recommendedProduct": {
        value: newVariables.recommendedProduct,
        required: false,
        type: "UpdateRecommendedProductInput"
      }
    },
    options,
    null,
    false
  );
}
async function deleteRecommendedProduct(id, options) {
  return await (0, import_api_client_core.actionRunner)(
    this,
    "deleteRecommendedProduct",
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
class RecommendedProductManager {
  constructor(connection) {
    this.connection = connection;
    /**
    * Finds one recommendedProduct by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
    **/
    this.findOne = Object.assign(
      async (id, options) => {
        return await (0, import_api_client_core.findOneRunner)(
          this,
          "recommendedProduct",
          id,
          DefaultRecommendedProductSelection,
          apiIdentifier,
          options
        );
      },
      {
        type: "findOne",
        findByVariableName: "id",
        operationName: "recommendedProduct",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultRecommendedProductSelection
      }
    );
    /**
    * Finds one recommendedProduct by ID. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
    **/
    this.maybeFindOne = Object.assign(
      async (id, options) => {
        const record = await (0, import_api_client_core.findOneRunner)(
          this,
          "recommendedProduct",
          id,
          DefaultRecommendedProductSelection,
          apiIdentifier,
          options,
          false
        );
        return record.isEmpty() ? null : record;
      },
      {
        type: "maybeFindOne",
        findByVariableName: "id",
        operationName: "recommendedProduct",
        modelApiIdentifier: "recommendedProduct",
        defaultSelection: DefaultRecommendedProductSelection
      }
    );
    /**
    * Finds many recommendedProduct. Returns a `Promise` for a `GadgetRecordList` of objects according to the passed `options`. Optionally filters the returned records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
    **/
    this.findMany = Object.assign(
      async (options) => {
        return await (0, import_api_client_core.findManyRunner)(
          this,
          "recommendedProducts",
          DefaultRecommendedProductSelection,
          "recommendedProduct",
          options
        );
      },
      {
        type: "findMany",
        operationName: "recommendedProducts",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultRecommendedProductSelection
      }
    );
    /**
    * Finds the first matching recommendedProduct. Returns a `Promise` that resolves to a record if found and rejects the promise if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` and `first`/`after` pagination options.
    **/
    this.findFirst = Object.assign(
      async (options) => {
        const list = await (0, import_api_client_core.findManyRunner)(
          this,
          "recommendedProducts",
          DefaultRecommendedProductSelection,
          apiIdentifier,
          { ...options, first: 1, last: void 0, before: void 0, after: void 0 },
          true
        );
        return list[0];
      },
      {
        type: "findFirst",
        operationName: "recommendedProducts",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultRecommendedProductSelection
      }
    );
    /**
    * Finds the first matching recommendedProduct. Returns a `Promise` that resolves to a record if found, or null if a record isn't found, according to the passed `options`. Optionally filters the searched records using `filter` option, sorts records using the `sort` option, searches using the `search` options, and paginates using the `last`/`before` pagination options.
    **/
    this.maybeFindFirst = Object.assign(
      async (options) => {
        const list = await (0, import_api_client_core.findManyRunner)(
          this,
          "recommendedProducts",
          DefaultRecommendedProductSelection,
          apiIdentifier,
          { ...options, first: 1, last: void 0, before: void 0, after: void 0 },
          false
        );
        return (list == null ? void 0 : list[0]) ?? null;
      },
      {
        type: "maybeFindFirst",
        operationName: "recommendedProducts",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultRecommendedProductSelection
      }
    );
    /**
    * Finds one recommendedProduct by its id. Returns a Promise that resolves to the record if found and rejects the promise if the record isn't found.
    **/
    this.findById = Object.assign(
      async (value, options) => {
        return await (0, import_api_client_core.findOneByFieldRunner)(
          this,
          "recommendedProducts",
          "id",
          value,
          DefaultRecommendedProductSelection,
          apiIdentifier,
          options
        );
      },
      {
        type: "findOne",
        findByVariableName: "id",
        operationName: "recommendedProducts",
        modelApiIdentifier: apiIdentifier,
        defaultSelection: DefaultRecommendedProductSelection
      }
    );
    this.create = Object.assign(
      createRecommendedProduct,
      {
        type: "action",
        operationName: "createRecommendedProduct",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: apiIdentifier,
        isBulk: false,
        defaultSelection: DefaultRecommendedProductSelection,
        variables: {
          "recommendedProduct": {
            required: false,
            type: "CreateRecommendedProductInput"
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
          "bulkCreateRecommendedProducts",
          DefaultRecommendedProductSelection,
          "recommendedProduct",
          "recommendedProducts",
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
        operationName: "bulkCreateRecommendedProducts",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: "recommendedProducts",
        isBulk: true,
        defaultSelection: DefaultRecommendedProductSelection,
        variables: {
          inputs: {
            required: true,
            type: "[BulkCreateRecommendedProductsInput!]"
          }
        },
        hasReturnType: false,
        acceptsModelInput: true
      }
    );
    this.update = Object.assign(
      updateRecommendedProduct,
      {
        type: "action",
        operationName: "updateRecommendedProduct",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: apiIdentifier,
        isBulk: false,
        defaultSelection: DefaultRecommendedProductSelection,
        variables: {
          id: {
            required: true,
            type: "GadgetID"
          },
          "recommendedProduct": {
            required: false,
            type: "UpdateRecommendedProductInput"
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
          "bulkUpdateRecommendedProducts",
          DefaultRecommendedProductSelection,
          "recommendedProduct",
          "recommendedProducts",
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
        operationName: "bulkUpdateRecommendedProducts",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: "recommendedProducts",
        isBulk: true,
        defaultSelection: DefaultRecommendedProductSelection,
        variables: {
          inputs: {
            required: true,
            type: "[BulkUpdateRecommendedProductsInput!]"
          }
        },
        hasReturnType: false,
        acceptsModelInput: true
      }
    );
    this.delete = Object.assign(
      deleteRecommendedProduct,
      {
        type: "action",
        operationName: "deleteRecommendedProduct",
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
          "bulkDeleteRecommendedProducts",
          null,
          "recommendedProduct",
          "recommendedProducts",
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
        operationName: "bulkDeleteRecommendedProducts",
        namespace: null,
        modelApiIdentifier: apiIdentifier,
        modelSelectionField: "recommendedProducts",
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
  DefaultRecommendedProductSelection,
  RecommendedProductManager
});
//# sourceMappingURL=RecommendedProduct.js.map
