import { verifyHmac } from './utils';

export default async function route({ request, reply, api, logger, connections }) {
  const hmac = request.headers['X-Shopify-Hmac-SHA256'];
  const data = JSON.stringify(request.body);

  if (!verifyHmac(data, hmac)) {
    await reply.code(401).type('text/plain').send('Not authorised');
    return;
  }

  const { shop } = request;

  try {
    const res = await api.shopifyGdprRequest.create({
      topic: 'shop/redact',
      shop: {
        domain: shop?.domain ?? 'DUMMY',
      },
    });
    logger.info('request successful: ' + JSON.stringify(res));
    await reply.code(200).type('text/plain').send('Request was successful.');
  } catch (error) {
    logger.error(JSON.stringify(error));
    await reply.code(500).type('text/plain').send('Internal Server Error');
  }
}
