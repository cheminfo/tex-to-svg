import { Buffer } from 'node:buffer';

import { Type } from '@sinclair/typebox';
import sharp from 'sharp';

import { renderLatex } from '../renderer.ts';
import type { FastifyTyped } from '../types.ts';

const querySchema = Type.Object({
  tex: Type.Optional(Type.String()),
  format: Type.Optional(Type.Union([Type.Literal('svg'), Type.Literal('png')])),
  backgroundColor: Type.Optional(Type.String()),
  resolution: Type.Optional(Type.String()),
});

function injectBackground(svg: string, color: string): string {
  return svg.replace(/<svg(?:\s[^>]*)?>/, (match) => {
    if (match.includes('style="')) {
      return match.replace('style="', `style="background-color: ${color}; `);
    }
    return match.replace('<svg', `<svg style="background-color: ${color};"`);
  });
}

/**
 * Register routes for LaTeX rendering.
 * - GET /    — legacy compat: redirects to /v1/ when tex param is present
 *              and the client is not a browser (e.g. an <img> tag).
 * - GET /v1/ — canonical renderer (SVG or PNG)
 * @param fastify - The Fastify instance to register routes on.
 */
export default async function renderRoutes(fastify: FastifyTyped) {
  fastify.get(
    '/',
    { schema: { querystring: querySchema } },
    async (request, reply) => {
      const { tex } = request.query;
      if (!tex) return reply.callNotFound();
      const accept = request.headers.accept ?? '';
      if (accept.includes('text/html')) return reply.callNotFound();
      const { search } = new URL(request.url, 'http://localhost');
      return reply.redirect(`/v1/${search}`, 302);
    },
  );

  fastify.get(
    '/v1/',
    { schema: { querystring: querySchema } },
    async (request, reply) => {
      const {
        tex,
        format = 'svg',
        backgroundColor = 'white',
        resolution = '150',
      } = request.query;

      if (!tex) {
        return reply.redirect('/');
      }

      let result;
      try {
        result = await renderLatex(tex);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return reply
          .status(400)
          .header('Content-Type', 'text/plain')
          .send(`LaTeX error: ${message}`);
      }

      const svgWithBg = injectBackground(result.svg, backgroundColor);

      if (format === 'png') {
        const dpi = Number(resolution) || 150;
        const pngBuffer = await sharp(Buffer.from(svgWithBg), { density: dpi })
          .png()
          .toBuffer();
        return reply
          .header('Content-Type', 'image/png')
          .header('Cache-Control', 'public, max-age=86400')
          .send(pngBuffer);
      }

      return reply
        .header('Content-Type', 'image/svg+xml')
        .header('Cache-Control', 'public, max-age=86400')
        .send(svgWithBg);
    },
  );
}
