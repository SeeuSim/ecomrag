import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://ecomrag.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "shopify-app-users": {
      storageKey: "Role-Shopify-App",
      models: {
        chatbotSettings: {
          read: {
            filter:
              "accessControl/filters/chatbotSettings/tenacy.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        plan: {
          read: {
            filter: "accessControl/filters/plan/plan.gelly",
          },
        },
        shopifyGdprRequest: {
          read: {
            filter:
              "accessControl/filters/shopifyGdprRequest/shopifyGdprRequest.gelly",
          },
          actions: {
            create: true,
            update: true,
          },
        },
        shopifyOrder: {
          read: {
            filter:
              "accessControl/filters/shopifyOrder/shopifyOrder.gelly",
          },
        },
        shopifyOrderLineItem: {
          read: {
            filter:
              "accessControl/filters/shopifyOrderLineItem/shopifyOrderLineItem.gelly",
          },
        },
        shopifyProduct: {
          read: {
            filter:
              "accessControl/filters/shopifyProduct/shopifyProduct.gelly",
          },
        },
        shopifyProductImage: {
          read: {
            filter:
              "accessControl/filters/shopifyProductImage/shopifyProductImage.gelly",
          },
        },
        shopifyShop: {
          read: {
            filter:
              "accessControl/filters/shopifyShop/shopifyShop.gelly",
          },
          actions: {
            createAppCharge: true,
            install: true,
            reinstall: true,
            subscribe: true,
            uninstall: true,
            update: true,
          },
        },
        shopifySync: {
          read: {
            filter:
              "accessControl/filters/shopifySync/shopifySync.gelly",
          },
          actions: {
            abort: true,
            complete: true,
            error: true,
            run: true,
          },
        },
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
    },
  },
};
