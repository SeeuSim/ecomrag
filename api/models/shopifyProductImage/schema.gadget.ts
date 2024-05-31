import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProductImage" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-ProductImage",
  fields: {
    imageDescription: {
      type: "string",
      default: "",
      storageKey: "c6vyQ0xsIgTF::4hKm1gLGOhGf",
    },
    imageDescriptionEmbedding: {
      type: "vector",
      storageKey:
        "ModelField-zdqGCfGiOnWJ::FieldStorageEpoch-cv5bCiFtsaAT",
    },
  },
  shopify: {
    fields: [
      "alt",
      "height",
      "position",
      "product",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "source",
      "width",
    ],
  },
};
