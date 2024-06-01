import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "analyticsTimeSeries" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "9PA2FcW8nlTg",
  fields: {
    chatSessionCount: {
      type: "number",
      default: 0,
      decimals: 0,
      validations: { numberRange: { min: 0, max: null } },
      storageKey: "-yAzmbcgeqgv",
    },
    convertedProducts: {
      type: "hasManyThrough",
      sibling: {
        model: "shopifyProduct",
        relatedField: "analyticsEntry",
      },
      join: {
        model: "analyticsProductEntry",
        belongsToSelfField: "timeseries",
        belongsToSiblingField: "product",
      },
      storageKey: "Uem37IfzGdQs",
    },
    dateTime: {
      type: "dateTime",
      includeTime: true,
      storageKey: "h1NUtPWNNbZi",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "f_tn1C6InOlY",
    },
  },
};
