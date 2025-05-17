# Holis.social Website

This is the codebase for the Holis Social website, a community-powered platform for messaging, planning, funding, and growing - without ads, algorithms, or fear of being shut down.

## Features

- Modern UI with shadcn/ui components
- Cloudflare Workers deployment 
- Built with React and Tailwind CSS
- Responsive design for all devices

## Development

To run the development server:

```bash
npm run dev
```

This will start both the Tailwind CSS watcher and the Cloudflare Workers development server.

## Building and Deployment

To build the project:

```bash
npm run build
```

This will:
1. Compile Tailwind CSS
2. Bundle the TypeScript/React code with esbuild
3. Copy static assets to the dist directory

To deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)