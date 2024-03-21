export default async function route({ request, reply, api, logger, connections }) {
  const { customer } = request;
  try {
    const res = await api.shopifyGdprRequest.create({
      topic: 'customers/redact',
      customer: {
        id: customer?.id?? 'DUMMY',
      },
    });
    logger.info('request successful: ' + JSON.stringify(res));
    await reply.code(200).type('text/plain').send('Request was successful.');
  } catch (error) {
    logger.error(JSON.stringify(error));
    await reply.code(500).type('text/plain').send('Internal Server Error');
  }
}