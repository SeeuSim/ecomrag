import { Reply, Request, api as gadgetApi, logger as gadgetLogger } from 'gadget-server';

/**
 * Increments the current shop's conversation count.
 *
 * Performs this action by performing the following steps, in order:
 *
 * 1. Parses the request body for the shopId.
 * 2. Increments the conversationCount atomically in the API.
 *
 * @type { (params: { request: Request, reply: Reply, api: typeof gadgetApi, logger: typeof gadgetLogger }) => Promise<void> }
 **/
export default async function route({ request, reply, api, logger, connections }) {
  try {
    await api.internal.plan.update('1', {
      _atomics: {
        productSyncCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    /**@type { Error } */
    const { name, message, cause, stack } = error;
    const formattedError = {
      name,
      message,
      cause,
      stack,
    };
    logger.error(formattedError, '[route | productSyncCount/increment] An error occurred.');
    await reply.code(500).type('text/plain').send('Internal Server Error');
    return;
  }
  await reply.code(200).type('text/plain').send('OK');
}