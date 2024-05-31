import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "chatLog" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-E6iynx5hHbWC",
  fields: {
    imageRecommendedProducts: {
      type: "hasManyThrough",
      sibling: {
        model: "shopifyProduct",
        relatedField: "chatRecommendations",
      },
      join: {
        model: "imageRecommendedProduct",
        belongsToSelfField: "chatLog",
        belongsToSiblingField: "product",
      },
      storageKey: "4NAcztj9Sg_R::AobZK9ws9naN",
    },
    recommendedProducts: {
      type: "hasManyThrough",
      sibling: {
        model: "shopifyProduct",
        relatedField: "chatRecommendations",
      },
      join: {
        model: "recommendedProduct",
        belongsToSelfField: "chatLog",
        belongsToSiblingField: "product",
      },
      storageKey:
        "ModelField-YSN1_saLLsDa::FieldStorageEpoch-XVLg6ln_rkiw",
    },
    response: {
      type: "string",
      storageKey:
        "ModelField-S2asAc0UtXtq::FieldStorageEpoch-bDVuF_nzWaLW",
    },
  },
};
