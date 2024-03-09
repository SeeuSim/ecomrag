export default async function route({ request, reply }) {
  const { api, connections } = request;

  // get an instance of the shopify-api-node API client for this shop
  const shopify = await connections.shopify.forShopId(request.query.shop_id);

  // make an API call to Shopify to validate that the charge object for this shop is active
  const result = await shopify.graphql(`
    query {
      node(id: "gid://shopify/AppSubscription/${request.query.charge_id}") {
        id
        ... on AppSubscription {
          status
          name
        }
      }
    }
  `);

  if (result.node.status != 'ACTIVE') {
    // the merchant has not accepted the charge, so we can show them a message
    await reply.code(400).send('Invalid charge ID specified');
    return;
  }

  // the merchant has accepted the charge, so we can grant them access to our application
  // retrieve the plan name from the AppSubscription query result
  const planName = result.node.name;

  // example: mark the shop as paid by setting a `plan` attribute with the retrieved plan name
  await api.internal.shopifyShop.update(request.query.shop_id, { plan: planName });

  // send the user back to the embedded app
  await reply.redirect('/');
}
