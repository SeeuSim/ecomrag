import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-R8a3tfJKPJ3U",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey:
        "ModelField-s53YorlefYV6::FieldStorageEpoch-YgkBx6lty4y3",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
