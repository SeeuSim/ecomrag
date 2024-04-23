import { Reply, Request, api as gadgetApi, logger as gadgetLogger } from 'gadget-server';
import { stripHTMLTags } from '../batch-update/utils';

const BATCH_SIZE = 50;
const NEXTJS_BE_CONFIG = {
  host: 'https://searchshop-ai.vercel.app',
  route: 'api/models',
  shopModel: 'shop',
  productModel: 'product',
  productImageModel: 'productImage',
};
const SHOP_ALLOWED_PLANS = ['free', 'growth', 'premium', 'enterprise'];
const BASE_URL = `${NEXTJS_BE_CONFIG.host}/${NEXTJS_BE_CONFIG.route}`;

/**@type { (api: typeof gadgetApi, logger: typeof gadgetLogger, pgProductId: string, gadgetProductId: string) => Promise<void> } */
async function migrateProductImages(api, logger, pgProductId, gadgetProductId) {
  const endpoint = `${BASE_URL}/${NEXTJS_BE_CONFIG.productImageModel}`;
  let productImagePage = await api.shopifyProductImage.findMany({
    filter: {
      product: {
        equals: gadgetProductId,
      },
    },
  });
  let productImages = [...productImagePage];
  while (productImagePage.hasNextPage) {
    productImagePage = await productImagePage.nextPage();
    productImages = [...productImages, ...productImagePage];
  }

  for (let i = 0; i < productImages.length; i = i + BATCH_SIZE) {
    const batch = productImages.slice(i, i + BATCH_SIZE);
    const payload = {
      action: 'create',
      payload: {
        CreatePayload: batch.map((v) => ({
          source: v.source,
          productId: pgProductId,

          description:
            v.imageDescription && v.imageDescription.length > 0 ? v.imageDescription : '<>',
          alt: v.alt && v.alt.length > 0 ? v.alt : '<>',

          position: v.position ?? undefined,
          height: v.height ?? undefined,
          width: v.width ?? undefined,
          embedding: v.imageDescriptionEmbedding ?? undefined,
        })),
      },
    };
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      logger.error(
        await response.json(),
        `Error migrating products from shop with ID: PGID=${pgProductId} GGTID=${gadgetProductId}, Batch: ${i}, Products=${batch.map((v) => v.id)}`
      );
      continue;
    }

    logger.info(
      `Batch ${i} - ${Math.min(BATCH_SIZE + i, productImages.length)} / ${productImages.length} images for product PGID=${pgProductId} GGTID=${gadgetProductId} migrated successfully.`
    );
  }
}

/**@type { (api: typeof gadgetApi, logger: typeof gadgetLogger, pgShopId: string, gadgetShopId: string) => Promise<void> } */
async function migrateProducts(api, logger, pgShopId, gadgetShopId) {
  const endpoint = `${BASE_URL}/${NEXTJS_BE_CONFIG.productModel}`;
  let productPage = await api.shopifyProduct.findMany({
    filter: {
      shop: {
        equals: gadgetShopId,
      },
    },
  });
  let products = [...productPage];
  while (productPage.hasNextPage) {
    productPage = await productPage.nextPage();
    products = [...products, ...productPage];
  }

  /**@type { Array<{ id: string, gadgetId: string }> } */
  let migratedProducts = [];
  for (let i = 0; i < products.length; i = i + BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const payload = {
      action: 'create',
      payload: {
        CreatePayload: batch.map((v) => {
          const strippedBody = stripHTMLTags(v.body);
          return {
            title: v.title && v.title.length > 0 ? v.title : 'PLACEHOLDER',
            shopId: pgShopId,
            body: strippedBody.length > 0 ? strippedBody : undefined,
            handle: v.handle ?? undefined,
            vendor: v.vendor ?? undefined,
            status: v.status ?? undefined,
            tags: v.tags ?? [],
            embedding: v.descriptionEmbedding ?? undefined,
          };
        }),
      },
    };
    const res = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      logger.error(
        await res.json(),
        `Error migrating products from shop with ID: PGID=${pgShopId} GGTID=${gadgetShopId}, Batch: ${i}, Products=${batch.map((v) => v.id)}`
      );
      continue;
    }
    /** @type { { created?: Array<{ id: string}> } } */
    const results = await res.json();
    if (results.created) {
      migratedProducts = [
        ...migratedProducts,
        ...results.created.map((v, index) => ({
          id: v.id,
          gadgetId: batch[index].id,
        })),
      ];
    }
  }

  logger.info(
    `Products from Shop: PGID=${pgShopId} GGTID=${gadgetShopId} migrated. Migrating product images...`
  );

  for (const product of migratedProducts) {
    try {
      await migrateProductImages(api, logger, product.id, product.gadgetId);
    } catch (error) {
      logger.error(
        { name: error.name, message: error.message, stack: error.stack },
        `Product GGTID=${product.gadgetId} | PGID=${product.id} failed to migrate product images.`
      );
    }
  }
}

/**
 * Migrates all of the data to NextJS.
 *
 * @type { (params: { request: Request, reply: Reply, api: typeof gadgetApi, logger: typeof gadgetLogger }) => Promise<void> }
 **/
export default async function route({ request, reply, api, logger, connections }) {
  let shopPayload = await api.shopifyShop.findMany();
  let shops = [...shopPayload];
  while (shopPayload.hasNextPage) {
    shopPayload = await shopPayload.nextPage();
    shops = [...shops, ...shopPayload];
  }

  // 1. Migrate Shops
  /**@type { Array<{ id: string, gadgetId: string }> } */
  let migratedShops = [];

  const shopRoute = `${BASE_URL}/${NEXTJS_BE_CONFIG.shopModel}`;
  for (let i = 0; i < shops.length; i = i + BATCH_SIZE) {
    const batch = shops.slice(i, i + BATCH_SIZE);
    const payload = {
      action: 'create',
      payload: {
        CreatePayload: batch.map((v) => ({
          // Required Fields
          name: v.name,
          email: v.email ?? 'placeholder@searchshop.ai',
          country: v.country ?? 'USA',
          city: v.city ?? 'San Francisco',
          // Optional Fields
          domain: v.domain ?? undefined,
          plan: SHOP_ALLOWED_PLANS.includes(v.Plan) ? v.Plan : undefined,
        })),
      },
    };
    try {
      const res = await fetch(shopRoute, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        logger.error(
          await res.json(),
          `Shop Migrate Post Failed: Batch=${i}, Shops=${batch.map((v) => v.id)}`
        );
        continue;
      }
      /**@type { { created?: Array<{ id: string }> }} */
      const result = await res.json();
      if (result.created) {
        migratedShops = [
          ...migratedShops,
          ...result.created.map((v, index) => ({ id: v.id, gadgetId: batch[index].id })),
        ];
      }
    } catch (error) {
      logger.error(
        { name: error.name, message: error.message, stack: error.stack },
        'Shop Migrate Failed: ' + `${i}`
      );
    }
  }

  logger.info('Shops Migrated. Migrating products...');

  // 2. Migrate products
  for (const shop of migratedShops) {
    try {
      await migrateProducts(api, logger, shop.id, shop.gadgetId);
    } catch (error) {
      logger.error(
        { name: error.name, message: error.message, stack: error.stack },
        `Shop GGTID=${shop.gadgetId} | PGID=${shop.id} was unable to migrate products.`
      );
    }
  }
}
