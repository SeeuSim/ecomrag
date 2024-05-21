import { RouteContext } from 'gadget-server';

/**
 * Route handler for POST batch-update/nuke-shop
 *
 * @param { RouteContext } route context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  /**@type {{ shopId: string }} */
  let data = request.body;
  let shopDeleted = false;
  if (data.shopId) {
    try {
      await api.internal.shopifyShop.delete(data.shopId);
    } catch (error) {
      // /**@type { Error } */
      // let err = error;
      // await reply.status(500).send({
      //   message: err.message,
      //   stack: err.stack,
      //   name: err.name,
      //   cause: err.cause,
      // });
      // return;
      shopDeleted = true;
    }

    try {
      await api.internal.shopifyProduct.deleteMany({
        filter: {
          shop: {
            equals: data.shopId,
          },
        },
      });
    } catch (error) {
      /**@type { Error } */
      let err = error;
      await reply.status(500).send({
        message: err.message,
        stack: err.stack,
        name: err.name,
        cause: err.cause,
      });
      return;
    }
    try {
      await api.internal.shopifyProductImage.deleteMany({
        filter: {
          shop: {
            equals: data.shopId,
          },
        },
      });
    } catch (error) {
      /**@type { Error } */
      let err = error;
      await reply.status(500).send({
        message: err.message,
        stack: err.stack,
        name: err.name,
        cause: err.cause,
      });
      return;
    }
    await reply
      .status(200)
      .send(
        'All records deleted!' + shopDeleted
          ? ` | Shop with id: ${data.shopId} was already deleted.`
          : ''
      );
  }
}
