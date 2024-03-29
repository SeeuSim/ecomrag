// Our `img-embed` endpoint can handle both text and image data.
const { EMBEDDING_ENDPOINT } = process.env;

export const tryIncrShopSyncCount = async ({ params, record, api, logger, connections }) => {
  const currShop = await api.shopifyShop.findOne(record.shopId, { select: { Plan: true } });
  const plan = currShop.Plan;
  const planLimits = {
    free: 100,
    growth: 500,
    premium: 2000,
  };

  // Check the current plan and get the product limit
  const productLimit = planLimits[plan] || 0;

  // Fetch the current count of products with embeddings
  // const embeddedProductCount = await api.internal.shopifyProduct.findMany({
  //   where: { descriptionEmbedding: { _not_null: true } },
  // });
  // const productCount = embeddedProductCount.length;
  const productSyncCount = currShop.productSyncCount ?? 0;

  // Only proceed if the product count is within the limit
  // only run if the product does not have an embedding, or if the title or body have changed
  logger.info({ productCount: productSyncCount, productLimit }, 'product count and limit');
  if (
    (productSyncCount < productLimit && !record.descriptionEmbedding) ||
    record.changed('title') ||
    record.changed('body')
  ) {
    try {
      // use the internal API to store vector embedding in Gadget database, on shopifyProduct model
      const shop = await api.shopifyShop.findOne(record.shopId);
      if (shop) {
        await api.internal.shopifyShop.update(shop.id, {
          shopifyShop: {
            productSyncCount: productSyncCount + 1,
          },
        });
        logger.info({ id: shop.id }, 'Incremented productSyncCount');
      }
      return true;
    } catch (error) {
      logger.error({ error }, 'Error incrementing Sync Count');
      return false;
    }
  } else {
    logger.info('Product limit reached for the current plan. Skipping embedding creation.');
    return false;
  }
};
