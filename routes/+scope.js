import cors from '@fastify/cors';
import { Server } from 'gadget-server';

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
    origin: '*', // allow requests from any domain
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'x-gadget-environment'],
    methods: ['GET', 'POST', 'PUT'],
  });
  await server.register(multipart);
}
