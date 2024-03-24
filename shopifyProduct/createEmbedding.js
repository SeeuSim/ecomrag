export const createProductEmbedding = async ({ params, record, api, logger, connections }) => {
  const currShop = await api.shopifyShop.findOne(record.shopId, { select: { plan: true } });
  const plan = currShop.Plan;
  logger('This is the plan logger' + plan);
  const planLimits = {
    free: 100,
    growth: 500,
    premium: 2000,
  };

  // Check the current plan and get the product limit
  const productLimit = planLimits[plan] || 0;

  // Fetch the current count of products with embeddings
  const productCount = await api.internal.shopifyProduct.count({
    where: { descriptionEmbedding: { _not_null: true } },
  });

  // Only proceed if the product count is within the limit
  // only run if the product does not have an embedding, or if the title or body have changed
  if (
    (productCount < productLimit && !record.descriptionEmbedding) ||
    record.changed('title') ||
    record.changed('body')
  ) {
    try {
      // get an embedding for the product title + description using the OpenAI connection
      const response = await connections.openai.embeddings.create({
        input: `${record.title}: ${record.body}`,
        model: 'text-embedding-ada-002',
      });
      const embedding = response.data[0].embedding;
      // write to the Gadget Logs
      logger.info({ id: record.id }, 'got product embedding');

      // use the internal API to store vector embedding in Gadget database, on shopifyProduct model
      const shop = await api.shopifyShop.findOne({ where: { id: record.shopId } });
      if (shop) {
        await api.internal.shopifyShop.update(shop.id, {
          shopifyShop: {
            productSyncCount: shop.productSyncCount + 1,
          },
        });
        logger.info({ id: shop.id }, 'Incremented productSyncCount');
      }
      await api.internal.shopifyProduct.update(record.id, {
        shopifyProduct: { descriptionEmbedding: embedding },
      });
    } catch (error) {
      logger.error({ error }, 'error creating embedding');
    }
  } else {
    logger.info('Product limit reached for the current plan. Skipping embedding creation.');
  }
};
