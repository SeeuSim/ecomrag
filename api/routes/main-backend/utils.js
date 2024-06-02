import { api as gadgetApi, logger as gadgetLogger } from 'gadget-server';
import { PLAN_TYPES } from '../../models/plan/utils';
import { stripHTMLTags } from '../batch-update/utils';

export const BATCH_SIZE = 50;
export const NEXTJS_BE_CONFIG = {
  host: 'https://searchshop-ai.vercel.app',
  route: 'api/models',
  gadgetRoute: 'api/gadget',
  shopModel: 'shop',
  productModel: 'product',
  productImageModel: 'productImage',
};
export const BASE_URL = `${NEXTJS_BE_CONFIG.host}/${NEXTJS_BE_CONFIG.route}`;
export const BASE_GADGET_URL = `${NEXTJS_BE_CONFIG.host}/${NEXTJS_BE_CONFIG.gadgetRoute}`;
const SHOP_ALLOWED_PLANS = ['free', 'growth', 'premium', 'enterprise'];
const EMBEDDING_DIM = 512;

// SHOP ====================================================================================================================

/**@type { (row: import('@gadget-client/ecomrag').ShopifyShop, api: typeof gadgetApi) => object } */
export const getShopInsertRow = async (row, api) => {
  const plan = await api.plan.maybeFindFirst({
    filter: {
      shop: {
        equals: row.id,
      },
    },
  });
  return {
    // Migration Field
    gadgetId: row.id,
    // Required Fields
    name: row.name,
    email: row.email && row.email.length > 0 ? row.email : 'PLACEHOLDER@searchshop.ai',
    country: row.country && row.country.length > 0 ? row.country : 'USA',
    city: row.city && row.city.length > 0 ? row.city : 'San Francisco',
    // Optional Fields
    domain: row.domain ?? undefined,
    plan: PLAN_TYPES.includes(plan?.tier) ? plan.tier : undefined,
  };
};

/**@type { (row: Awaited<ReturnType<typeof gadgetApi.shopifyShop.findOne>>) => object } */
export const getShopUpdateRow = (row) => {
  return {
    // Migration Field
    gadgetId: row.id,
    // Required Fields
    name: row.changed('name') ? row.name : undefined,
    email: row.changed('email') && row.email && row.email.length > 0 ? row.email : undefined,
    country:
      row.changed('country') && row.country && row.country.length > 0 ? row.country : undefined,
    city: row.changed('city') && row.city && row.city.length > 0 ? row.city : undefined,
    // Optional Fields
    domain: row.changed('domain') && row.domain ? row.domain : undefined,
    plan: row.changed('plan') && SHOP_ALLOWED_PLANS.includes(row.Plan) ? row.Plan : undefined,
  };
};

/**@type { (row: Awaited<ReturnType<typeof gadgetApi.shopifyShop.findOne>>) => object } */
export const getShopDeleteRow = (row) => {
  return {
    // Migration Field
    gadgetId: row.id,
  };
};

/**@type { (record: import('@gadget-client/ecomrag').ShopifyShop, logger: typeof gadgetLogger, api: typeof import('gadget-server').api) => Promise<void> } */
export async function postShopCreateResult(record, logger, api) {
  const endpoint = `${BASE_URL}/${NEXTJS_BE_CONFIG.shopModel}`;
  const payload = {
    action: 'create',
    payload: {
      CreatePayload: await getShopInsertRow(record, api),
    },
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    /**@type { Error } */
    const error = await res.json();
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      `Error occurred during Gadget's ShopifyShop Install/ReInstall action.`
    );
  }
}

/**@type { (record: Awaited<ReturnType<typeof gadgetApi.shopifyShop.findOne>>, logger: typeof gadgetLogger) => Promise<void> } */
export async function postShopUpdateResult(record, logger) {
  const endpoint = `${BASE_GADGET_URL}/${NEXTJS_BE_CONFIG.shopModel}`;
  const payload = {
    action: 'update',
    payload: getShopUpdateRow(record),
  };
  if (Object.values(payload.payload).filter((v) => v !== undefined).length <= 1) {
    return;
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    /**@type { Error } */
    const error = await res.json();
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      `Error occurred during Gadget's ShopifyShop Update action.`
    );
  }
}

/**@type { (record: Awaited<ReturnType<typeof gadgetApi.shopifyShop.findOne>>, logger: typeof gadgetLogger) => Promise<void> } */
export async function postShopDeleteResult(record, logger) {
  const endpoint = `${BASE_GADGET_URL}/${NEXTJS_BE_CONFIG.shopModel}`;
  const payload = {
    action: 'delete',
    payload: getShopDeleteRow(record),
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    /**@type { Error } */
    const error = await res.json();
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      `Error occurred during Gadget's ShopifyShop Uninstall action.`
    );
  }
}

// PRODUCT ====================================================================================================================

/**@type { (row: Awaited<ReturnType<typeof gadgetApi.shopifyProduct.findOne>>, shopId: string, isGadgetId?: boolean) => object } */
export const getProductInsertRow = (row, shopId, isGadgetId = false) => {
  const strippedBody = stripHTMLTags(row.body);

  const foreignKey = isGadgetId
    ? {
        shopGadgetId: shopId,
      }
    : {
        shopId,
      };

  return {
    // Migration
    gadgetId: row.id,
    // Required Fields
    title: row.title && row.title.length > 0 ? row.title : 'PLACEHOLDER',
    ...foreignKey,
    // Optional Non-Empty
    body: strippedBody.length > 0 ? strippedBody : undefined,
    handle: row.handle ?? undefined,
    vendor: row.vendor ?? undefined,
    status: row.status ?? undefined,
    // List, Optional Non-Empty members
    tags: row.tags ?? [],
    // Vector, 512
    embedding: row.descriptionEmbedding ?? undefined,
  };
};

/**@type { (row: Awaited<ReturnType<typeof gadgetApi.shopifyProduct.findOne>>) => object } */
export const getProductUpdateRow = (row) => {
  const body = stripHTMLTags(row.body);
  return {
    gadgetId: row.id,
    title: row.changed('title') && row.title && row.title.length > 0 ? row.title : undefined,
    body: row.changed('body') && body.length > 0 ? body : undefined,
    handle: row.changed('handle') ? row.handle : undefined,
    vendor: row.changed('vendor') ? row.vendor : undefined,
    status: row.changed('status') ? row.status : undefined,
    tags: row.changed('tags') ? row.tags : undefined,
    embedding:
      row.changed('descriptionEmbedding') &&
      row.descriptionEmbedding &&
      row.descriptionEmbedding.length === EMBEDDING_DIM
        ? row.descriptionEmbedding
        : undefined,
  };
};

/**@type { (row: Awaited<ReturnType<typeof gadgetApi.shopifyProduct.findOne>>) => object } */
export const getProductDeleteRow = (row) => {
  return {
    gadgetId: row.id,
  };
};

/**@type { (record: Awaited<ReturnType<typeof gadgetApi.shopifyProduct.findOne>>, logger: typeof gadgetLogger) => Promise<void> } */
export async function postProductCreateResult(record, logger) {
  const endpoint = `${BASE_GADGET_URL}/${NEXTJS_BE_CONFIG.productModel}`;
  const payload = {
    action: 'create',
    payload: getProductInsertRow(record, record.shop, true),
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    /**@type { Error } */
    const error = await res.json();
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      `Error occurred during Gadget's ShopifyProduct Create action.`
    );
  }
}

/**@type { (record: Awaited<ReturnType<typeof gadgetApi.shopifyShop.findOne>>, logger: typeof gadgetLogger) => Promise<void> } */
export async function postProductUpdateResult(record, logger) {
  const endpoint = `${BASE_GADGET_URL}/${NEXTJS_BE_CONFIG.productModel}`;
  const payload = {
    action: 'update',
    payload: getProductUpdateRow(record),
  };
  if (Object.values(payload.payload).filter((v) => v !== undefined).length <= 1) {
    return;
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    /**@type { Error } */
    const error = await res.json();
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      `Error occurred during Gadget's ShopifyProduct Update action.`
    );
  }
}

/**@type { (record: Awaited<ReturnType<typeof gadgetApi.shopifyShop.findOne>>, logger: typeof gadgetLogger) => Promise<void> } */
export async function postProductDeleteResult(record, logger) {
  const endpoint = `${BASE_GADGET_URL}/${NEXTJS_BE_CONFIG.productModel}`;
  const payload = {
    action: 'delete',
    payload: getProductDeleteRow(record),
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    /**@type { Error } */
    const error = await res.json();
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      `Error occurred during Gadget's ShopifyProduct Delete action.`
    );
  }
}

// PRODUCT IMAGE ====================================================================================================================

/**@type { (row: Awaited<ReturnType<typeof gadgetApi.shopifyProductImage.findOne>>, productId: string, isGadgetId?: boolean) => object } */
export const getProductImageInsertRow = (row, productId, isGadgetId = false) => {
  const foreignKey = isGadgetId
    ? {
        productGadgetId: productId,
      }
    : {
        productId,
      };

  return {
    // Migration
    gadgetId: row.id,
    // Required Fields
    source: row.source,
    ...foreignKey,

    // Text, Optional Non-Empty
    description:
      row.imageDescription && row.imageDescription.length > 0 ? row.imageDescription : '<>',
    alt: row.alt && row.alt.length > 0 ? row.alt : '<>',

    // Numeric, Optional Non-negative
    position: row.position ?? undefined,
    height: row.height ?? undefined,
    width: row.width ?? undefined,
    // Vector, 512
    embedding: row.imageDescriptionEmbedding ?? undefined,
  };
};

/**@type { (row: Awaited<ReturnType<typeof gadgetApi.shopifyProductImage.findOne>>) => object } */
export const getProductImageUpdateRow = (row) => {
  return {
    gadgetId: row.id,

    source: row.changed('source') && row.source && row.source.length > 0 ? row.source : undefined,
    description:
      row.changed('imageDescription') && row.imageDescription && row.imageDescription.length > 0
        ? row.imageDescription
        : undefined,
    alt: row.changed('alt') && row.alt && row.alt.length > 0 ? row.alt : undefined,

    position: row.changed('position') && row.position ? row.position : undefined,
    height: row.changed('height') && row.height ? row.height : undefined,
    width: row.changed('width') && row.width ? row.width : undefined,
    // Vector, 512
    embedding:
      row.changed('imageDescriptionEmbedding') &&
      row.imageDescriptionEmbedding &&
      row.imageDescriptionEmbedding.length === EMBEDDING_DIM
        ? row.imageDescriptionEmbedding
        : undefined,
  };
};

/**@type { (row: Awaited<ReturnType<typeof gadgetApi.shopifyProductImage.findOne>>) => object } */
export const getProductImageDeleteRow = (row) => {
  return {
    gadgetId: row.id,
  };
};

/**@type { (record: Awaited<ReturnType<typeof gadgetApi.shopifyProductImage.findOne>>, logger: typeof gadgetLogger) => Promise<void> } */
export async function postProductImageCreateResult(record, logger) {
  const endpoint = `${BASE_GADGET_URL}/${NEXTJS_BE_CONFIG.productImageModel}`;
  const payload = {
    action: 'create',
    payload: getProductImageInsertRow(record, record.product, true),
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    /**@type { Error } */
    const error = await res.json();
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      `Error occurred during Gadget's ShopifyProduct Create action.`
    );
  }
}

/**@type { (record: Awaited<ReturnType<typeof gadgetApi.shopifyProductImage.findOne>>, logger: typeof gadgetLogger) => Promise<void> } */
export async function postProductImageUpdateResult(record, logger) {
  const endpoint = `${BASE_GADGET_URL}/${NEXTJS_BE_CONFIG.productImageModel}`;
  const payload = {
    action: 'update',
    payload: getProductImageUpdateRow(record),
  };
  if (Object.values(payload.payload).filter((v) => v !== undefined).length <= 1) {
    return;
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    /**@type { Error } */
    const error = await res.json();
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      `Error occurred during Gadget's ShopifyProductImage Update action.`
    );
  }
}

/**@type { (record: Awaited<ReturnType<typeof gadgetApi.shopifyProductImage.findOne>>, logger: typeof gadgetLogger) => Promise<void> } */
export async function postProductImageDeleteResult(record, logger) {
  const endpoint = `${BASE_GADGET_URL}/${NEXTJS_BE_CONFIG.productImageModel}`;
  const payload = {
    action: 'delete',
    payload: getProductImageDeleteRow(record),
  };
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    /**@type { Error } */
    const error = await res.json();
    logger.error(
      { name: error.name, message: error.message, stack: error.stack },
      `Error occurred during Gadget's ShopifyProductImage Delete action.`
    );
  }
}
