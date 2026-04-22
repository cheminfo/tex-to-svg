import type { FastifyTyped } from '../types.ts';

/**
 * Register health-check route.
 * @param fastify - The Fastify instance to register routes on.
 */
export default async function healthRoutes(fastify: FastifyTyped) {
  fastify.get('/api/health', async () => ({ status: 'ok' }));
}
