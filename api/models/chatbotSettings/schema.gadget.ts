import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "chatbotSettings" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "9qoX0C4xoX5n",
  fields: {
    introductionMessage: {
      type: "string",
      storageKey: "f3IaY3fcis_1::A6ABx9SPv5Ll",
    },
    name: {
      type: "string",
      default: "askshop.ai",
      storageKey: "hlS_0vvGqbW3::wP66Y6BuzAnP",
    },
    personality: {
      type: "enum",
      default: "AUTO",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: [
        "FRIENDLY",
        "INFORMATIVE",
        "PERSUASIVE",
        "WITTY",
        "EMPATHETIC",
        "AUTO",
      ],
      storageKey: "5AONBS7IgPFF::8AKxRQy_DW8U",
    },
    role: {
      type: "enum",
      default: "PROFESSIONAL",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: [
        "ADVISOR",
        "ENTHUSIAST",
        "PROFESSIONAL",
        "STORYTELLER",
        "CONCIERGE",
        "AUTO",
      ],
      storageKey: "N1xtLTqOfBw-::ugHKXJELELEn",
    },
    shop: {
      type: "belongsTo",
      parent: { model: "shopifyShop" },
      storageKey: "0JxdyDMu9SHq::RgjOMH5Y2lRy",
    },
    talkativeness: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["1", "2", "3", "4", "5"],
      storageKey: "SRM2zyu4Vdsf::To-Rdi3R6rCv",
    },
  },
};
