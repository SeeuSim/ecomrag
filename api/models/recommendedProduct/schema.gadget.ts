import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "recommendedProduct" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "O01VSJuPTbtN",
  fields: {
    chatLog: {
      type: "belongsTo",
      parent: { model: "chatLog" },
      storageKey: "nJ7tAd0x13E0",
    },
    product: {
      type: "belongsTo",
      parent: { model: "shopifyProduct" },
      storageKey: "1pCr83Pk7RF0",
    },
    recommendationSource: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: [
        "ProductDescriptionEmbedding",
        "ProductImageDescriptionEmbedding",
      ],
      validations: { required: true },
      storageKey: "g5TYNoIyNcyd",
    },
  },
};
