# kucho-store-app

A React application built with Vite and Cloudflare Pages.

## Tech Stack

- **Vite** - Build tool and dev server
- **React 19** - UI framework
- **Tailwind CSS v4** - Styling
- **Cloudflare Pages** - Deployment with Functions and D1 database
- **Wouter** - Routing
- **Framer Motion** - Animations

## Installation

```bash
bun install
# or
npm install
```

## Development

### Quick Start (Recommended)

For full-stack development with instant hot reloading:

```bash
bun run dev:full
# or
npm run dev:full
```

Then open **`http://localhost:5173/`** in your browser.

This runs:
- **Vite dev server** at `http://localhost:5173/` with instant Hot Module Replacement (HMR)
- **Wrangler Pages dev** at `http://localhost:8788/` for API Functions, D1 database, and environment variables
- API requests from the frontend are automatically proxied to the backend

### Development Scripts

| Command | Description | Use When |
|---------|-------------|----------|
| `bun run dev` | Vite dev server only (port 5173) | Frontend-only work, no API needed |
| `bun run dev:api` | Wrangler Pages dev only (port 8788) | Testing API endpoints directly |
| `bun run dev:full` | **Both Vite + Wrangler** (ports 5173 + 8788) | **Full-stack development** ⭐ |
| `bun run build` | Production build | Before deployment |
| `bun run serve` | Serve production build | Test production build locally |

### How Hot Module Replacement Works

When you save a file:
1. Vite detects the change instantly
2. Only the changed module is updated in the browser
3. Your app state is preserved (no full page reload)
4. You see changes in **under 100ms**

**Important:** Make sure you're accessing `http://localhost:5173/` (Vite) for HMR, not `http://localhost:8788/` (Wrangler).

### Troubleshooting HMR

If hot reloading isn't working:

1. **Verify you're on the correct port:** Use `http://localhost:5173/`, not 8788
2. **Check browser console:** Open DevTools (F12) and look for:
   - `[vite] hot updated: /src/...` messages when you save
   - WebSocket connection errors
3. **Hard refresh:** Try Ctrl+Shift+R (or Cmd+Shift+R on Mac)
4. **Clear Vite cache:** `rm -rf node_modules/.vite` then restart dev server
5. **Disable browser extensions:** Some extensions block WebSockets
6. **Check both servers are running:** You should see output from both `[0]` (Vite) and `[1]` (Wrangler)

## Build

Build for production:

```bash
bun run build
# or
npm run build
```

This creates optimized production files in the `dist/` directory.

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

## Project Structure

```
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── lib/            # Utilities and helpers
│   ├── styles/         # Global styles
│   └── frontend.tsx    # App entry point
├── functions/          # Cloudflare Pages Functions (API routes)
│   └── api/           # API endpoints
├── dist/              # Production build output
└── wrangler.toml      # Cloudflare configuration
```

## API Routes

API endpoints are in the `functions/api/` directory and are automatically deployed as Cloudflare Pages Functions. They're accessible at `/api/*` paths.

During development with `bun run dev:full`, API requests are proxied from Vite (port 5173) to Wrangler (port 8788).

## Environment Variables

Environment variables and D1 database bindings are configured in `wrangler.toml`.

