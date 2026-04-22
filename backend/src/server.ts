import { existsSync } from 'node:fs';
import { join } from 'node:path';

import fastifyStatic from '@fastify/static';

import { buildApp } from './app.ts';

const fastify = await buildApp();

// Serve the built frontend in production; in dev the Vite server handles it
const frontendDist = join(import.meta.dirname, '../../frontend/dist');
if (existsSync(frontendDist)) {
  await fastify.register(fastifyStatic, {
    root: frontendDist,
    prefix: '/',
    decorateReply: true,
  });

  fastify.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/v1/') || request.url.startsWith('/api/')) {
      return reply.code(404).send({ error: 'Not found' });
    }
    return reply.sendFile('index.html');
  });
}

const port = process.env.PORT ? Number(process.env.PORT) : 3043;
await fastify.listen({ port, host: '0.0.0.0' });
