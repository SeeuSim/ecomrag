/**
 * Route handler for GET hello
 *
 * @param { import('gadget-server').RouteContext } context - see: https://docs.gadget.dev/guides/http-routes/route-configuration#route-context
 *
 */
export default async function route({ request, reply, api, logger, connections }) {
  // This route file will respond to an http request -- feel free to edit or change it!
  // For more information on HTTP routes in Gadget applications, see https://docs.gadget.dev/guides/http-routes
  try {
    const shopId = request.query.shopId;
    const chatBotSetting = await api.chatbotSettings.findFirst({
      filter: {
        shopId: {
          equals: shopId,
        },
      },
    });
    logger.info(chatBotSetting);
    await reply
      .type('application/json')
      .send({ name: chatBotSetting.name, introductionMessage: chatBotSetting.introductionMessage });
  } catch (error) {
    await reply.type('application/json').send({ message: 'Not Found' });
  }
}