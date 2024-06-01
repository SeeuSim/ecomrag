import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "analyticsProductEntry" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "VC4ZzMLVjCb_",
  fields: {
    count: {
      type: "number",
      default: 0,
      decimals: 0,
      validations: { numberRange: { min: -6, max: null } },
      storageKey: "zFfELKXJYUcb",
    },
    product: {
      type: "belongsTo",
      parent: { model: "shopifyProduct" },
      storageKey: "b6ezjO2xt2oy",
    },
    timeseries: {
      type: "belongsTo",
      parent: { model: "analyticsTimeSeries" },
      storageKey: "UKLPF6xTg5gK",
    },
  },
};
