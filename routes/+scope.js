import { Server } from 'gadget-server';
import cors from '@fastify/cors';

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
    origin: true, // allow requests from any domain
  });
  await server.register(multipart);
}
