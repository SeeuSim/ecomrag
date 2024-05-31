import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "imageRecommendedProduct" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "46dPfOzhkbH8",
  fields: {
    chatLog: {
      type: "belongsTo",
      parent: { model: "chatLog" },
      storageKey: "HKxTR7qYMkr3::ltNlUJrWoEaA",
    },
    product: {
      type: "belongsTo",
      parent: { model: "shopifyProduct" },
      storageKey: "fSMVW5jFQtQQ::YEyIIzk0EdKp",
    },
  },
};
