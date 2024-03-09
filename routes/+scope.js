import cors from '@fastify/cors';
import { Server, logger } from 'gadget-server';

const multipart = require('@fastify/multipart');

/**
 * Route plugin for *
 *
 * @param { Server } server - server instance to customize, with customizations scoped to descendant paths
 *
 * @see {@link https://www.fastify.dev/docs/latest/Reference/Server}
 */
export default async function (server) {
  await server.register(cors, {
    origin: (origin, cb) => {
      const hostname = new URL(origin).hostname;
      logger.info(`${new Date().toLocaleString()} | ${hostname}`);
      cb(null, true);
    }, // allow requests from any domain
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin'],
    methods: ['GET', 'POST', 'PUT'],
  });
  await server.register(multipart);
}
