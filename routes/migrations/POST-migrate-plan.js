/**
 * Migration for plan deployment
 *
 * @param { import('gadget-server').RouteContext } context
 */
export default async function route({ request, reply, api, logger, connection }) {
  let shopPage = await api.shopifyShop.findMany();
  let shops = [...shopPage];
  while (shopPage.hasNextPage) {
    shopPage = await shopPage.nextPage();
    shops = [...shops, ...shopPage];
  }

  try {
    const res = await api.plan.bulkCreate(
      shops.map((v) => ({
        shop: {
          _link: v.id,
        },
        tier: v.Plan ? v.Plan.replace(/^\w/, (c) => c.toUpperCase()) : 'Free',
        productSyncCount: v.productSyncCount ?? 0,
        imageUploadCount: v.productImageSyncCount ?? 0,
      }))
    );
    logger.info(res, 'Obtained response');
  } catch (error) {
    const { name, message, stack, cause } = /**@type { Error } */ (error);
    logger.error({ name, message, stack, cause }, 'An error occurred.');
    await reply.code(500).send('Internal Server Error');
    return;
  }
  await reply.code(200).send('OK');
}
