import { expect, test } from 'vitest';

import { buildApp } from '../app.ts';

const SIMPLE_FORMULA = 'x^2';
const COMPLEX_FORMULA = String.raw`\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`;

test('GET /v1/ without tex redirects to /', async () => {
  const app = await buildApp();
  const response = await app.inject({ method: 'GET', url: '/v1/' });

  expect(response.statusCode).toBe(302);
  expect(response.headers.location).toBe('/');

  await app.close();
});

test('GET /v1/?tex= returns SVG by default', async () => {
  const app = await buildApp();
  const response = await app.inject({
    method: 'GET',
    url: `/v1/?tex=${encodeURIComponent(SIMPLE_FORMULA)}`,
  });

  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toContain('image/svg+xml');
  expect(response.body).toContain('<svg');

  await app.close();
});

test('GET /v1/?tex= returns SVG with cache-control header', async () => {
  const app = await buildApp();
  const response = await app.inject({
    method: 'GET',
    url: `/v1/?tex=${encodeURIComponent(SIMPLE_FORMULA)}`,
  });

  expect(response.headers['cache-control']).toBe('public, max-age=86400');

  await app.close();
});

test('GET /v1/?tex=&format=svg returns SVG explicitly', async () => {
  const app = await buildApp();
  const response = await app.inject({
    method: 'GET',
    url: `/v1/?tex=${encodeURIComponent(SIMPLE_FORMULA)}&format=svg`,
  });

  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toContain('image/svg+xml');

  await app.close();
});

test('GET /v1/?tex=&format=png returns PNG', async () => {
  const app = await buildApp();
  const response = await app.inject({
    method: 'GET',
    url: `/v1/?tex=${encodeURIComponent(SIMPLE_FORMULA)}&format=png`,
  });

  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toContain('image/png');
  // PNG magic bytes: 89 50 4E 47
  expect(response.rawPayload[0]).toBe(0x89);
  expect(response.rawPayload[1]).toBe(0x50);
  expect(response.rawPayload[2]).toBe(0x4e);
  expect(response.rawPayload[3]).toBe(0x47);

  await app.close();
});

test('GET /v1/?tex= injects white background by default', async () => {
  const app = await buildApp();
  const response = await app.inject({
    method: 'GET',
    url: `/v1/?tex=${encodeURIComponent(SIMPLE_FORMULA)}`,
  });

  expect(response.body).toContain('background-color: white');

  await app.close();
});

test('GET /v1/?tex=&backgroundColor=transparent injects custom background', async () => {
  const app = await buildApp();
  const response = await app.inject({
    method: 'GET',
    url: `/v1/?tex=${encodeURIComponent(SIMPLE_FORMULA)}&backgroundColor=transparent`,
  });

  expect(response.body).toContain('background-color: transparent');

  await app.close();
});

test('GET /v1/?tex= renders complex formula', async () => {
  const app = await buildApp();
  const response = await app.inject({
    method: 'GET',
    url: `/v1/?tex=${encodeURIComponent(COMPLEX_FORMULA)}`,
  });

  expect(response.statusCode).toBe(200);
  expect(response.body).toContain('<svg');

  await app.close();
});

test('GET /v1/?tex= renders unknown commands as error SVG', async () => {
  const app = await buildApp();
  // MathJax 3 renders unknown commands inline rather than aborting,
  // which is more useful than a 400 — users see the error in context.
  const response = await app.inject({
    method: 'GET',
    url: `/v1/?tex=${encodeURIComponent(String.raw`\invalidcommandxyz`)}`,
  });

  expect(response.statusCode).toBe(200);
  expect(response.headers['content-type']).toContain('image/svg+xml');
  expect(response.body).toContain('<svg');

  await app.close();
});
