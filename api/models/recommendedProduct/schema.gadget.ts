import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "recommendedProduct" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-_L12bvdMjwEN",
  fields: {
    chatLog: {
      type: "belongsTo",
      parent: { model: "chatLog" },
      storageKey:
        "ModelField-AAYnMKLVCb5B::FieldStorageEpoch-0b6vSsUxRKqD",
    },
    product: {
      type: "belongsTo",
      parent: { model: "shopifyProduct" },
      storageKey:
        "ModelField-VyIZBFCxXLWz::FieldStorageEpoch-kyWHI7s2ppXo",
    },
  },
};
