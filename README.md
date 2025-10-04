# kucho-store-app

A React application built with Vite and Cloudflare Pages.

## Tech Stack

- **Vite** - Build tool and dev server
- **React 19** - UI framework
- **Tailwind CSS v4** - Styling
- **Cloudflare Pages** - Deployment with D1 database
- **Cloudflare Vite Plugin** - Workers integration during development

## Installation

```bash
bun install
# or
npm install
```

## Development

Start the Vite dev server with Cloudflare Workers integration:

```bash
bun dev
# or
npm run dev
```

This will start the development server at `http://localhost:5173/` with hot module replacement and the Cloudflare Vite plugin enabled for local Workers development.

## Build

Build for production:

```bash
bun run build
# or
npm run build
```

## Preview

Preview the production build locally:

```bash
bun run preview
# or
npm run preview
```

## Deployment

Deploy to Cloudflare Pages:

```bash
wrangler pages deploy dist
```

