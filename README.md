# text-to-svg

**text-to-svg** renders LaTeX math formulas into SVG or PNG images on demand, served over a simple HTTP API. It is the self-hosted replacement for the public `tex.cheminfo.org` service (previously `cheminfo/tex-to-svg-docker`), using MathJax 3 server-side for high-fidelity output and a React + KaTeX frontend for interactive authoring and sharing.

## Features

- Stateless GET API — embed rendered math anywhere with a plain `<img>` tag
- SVG and PNG output with configurable background color and PNG resolution
- React frontend with live KaTeX preview, example gallery, and clipboard export
- Drop-in URL compatibility with `tex.cheminfo.org/?tex=...` bookmarks and links

## Local development

```sh
npm install      # installs all workspaces (backend + frontend)
npm run dev      # backend on :3043, frontend dev server on :5173
```

## API

### `GET /v1/?tex=<formula>`

| Parameter         | Default    | Description                     |
| ----------------- | ---------- | ------------------------------- |
| `tex`             | (required) | URL-encoded LaTeX formula       |
| `format`          | `svg`      | `svg` or `png`                  |
| `backgroundColor` | `white`    | Any CSS color string            |
| `resolution`      | `96`       | DPI, applies to PNG output only |

Returns `image/svg+xml` or `image/png`.

### `GET /?tex=<formula>`

Serves the React frontend with the formula preloaded. Compatible with existing `tex.cheminfo.org/?tex=...` links.

## Embed code

```html
<img src="https://tex.cheminfo.org/v1/?tex=E%3Dmc%5E2" alt="E=mc²" />
```

Replace the host with your own deployment URL as needed.

## Deployment

### Port-published

Copy `compose.example.yaml` to `compose.yaml` and start the service:

```sh
docker compose up -d
```

The container listens on `${PORT:-3043}`.

### Traefik (tex.cheminfo.org)

Copy `compose.example.traefik.yaml` to `compose.yaml` and start:

```sh
docker compose up -d
```

Requires an external Docker network named `traefik`. The example config routes `tex.cheminfo.org` with automatic TLS via Let's Encrypt.

---

Server-side rendering is powered by [MathJax 3](https://www.mathjax.org/). Live preview in the browser uses [KaTeX](https://katex.org/).
