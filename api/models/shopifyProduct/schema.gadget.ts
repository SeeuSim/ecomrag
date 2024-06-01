import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://ecomrag.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Product",
  fields: {
    chatRecommendations: {
      type: "hasManyThrough",
      sibling: { model: "chatLog", relatedField: null },
      join: {
        model: null,
        belongsToSelfField: null,
        belongsToSiblingField: null,
      },
      storageKey:
        "ModelField-c0mBPShqadO_::FieldStorageEpoch-CVkJwYpGP7pc",
    },
    descriptionEmbedding: {
      type: "vector",
      storageKey:
        "ModelField-11FAKm4viDlY::FieldStorageEpoch-NuYpYHdaX1nb",
    },
    imageCount: {
      type: "computed",
      sourceFile: "api/models/shopifyProduct/imageCount.gelly",
      storageKey: "Yts3VgeLC8QK::M9jo_bfhX67S",
    },
    price: {
      type: "number",
      decimals: 2,
      storageKey: "_8Hsk2jbT6Xi",
    },
  },
  shopify: {
    fields: [
      "body",
      "compareAtPriceRange",
      "handle",
      "images",
      "orderLineItems",
      "productCategory",
      "productType",
      "publishedAt",
      "publishedScope",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "status",
      "tags",
      "templateSuffix",
      "title",
      "vendor",
    ],
  },
};
