import cors from '@fastify/cors';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';

import healthRoutes from './routes/health.ts';
import renderRoutes from './routes/render.ts';

/**
 * Build and configure the Fastify application (without static serving).
 * Used by tests to get a clean app instance.
 * @returns Configured Fastify instance.
 */
export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await fastify.register(cors, { origin: '*' });
  await fastify.register(healthRoutes);
  await fastify.register(renderRoutes);

  return fastify;
}
