import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "plan" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "n0T9AZSS_941",
  fields: {
    chatSessionsCount: {
      type: "number",
      default: 0,
      decimals: 0,
      validations: { numberRange: { min: 0, max: null } },
      storageKey: "DaUVkVmmbfEo::WFteWokENK-k",
    },
    imageUploadCount: {
      type: "number",
      default: 0,
      decimals: 0,
      validations: { numberRange: { min: 0, max: null } },
      storageKey: "7cqSeiLDCYyb::EFkwESO5bBZE",
    },
    productSyncCount: {
      type: "number",
      default: 0,
      decimals: 0,
      validations: { numberRange: { min: 0, max: null } },
      storageKey: "eCvzgSlEZ0_6::icXznnXBriPp",
    },
    shop: {
      type: "belongsTo",
      validations: { unique: true },
      parent: { model: "shopifyShop" },
      storageKey: "K8ArtmqQih9q::3puF73nPkhbN",
    },
    tier: {
      type: "enum",
      default: "Free",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["Free", "Growth", "Premium", "Enterprise"],
      storageKey: "MSHKnnSB1Y38::eNzYyjrj5xLC",
    },
  },
};
