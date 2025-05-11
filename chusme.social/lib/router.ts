type RouteHandler = () => Promise<Response>;

const routeMap: Record<string, () => Promise<unknown>> = {
  '/': () => import('../routes/index').then(m => m.default),
  '/about': () => import('../routes/about').then(m => m.default),
  '/contribute': () => import('../routes/contribute').then(m => m.default),
  '/how-it-works': () => import('../routes/how-it-works').then(m => m.default),
  '/pricing': () => import('../routes/pricing').then(m => m.default),
  '/use-cases/tenants': () => import('../routes/use-cases/tenants').then(m => m.default),
  '/use-cases/mutual-aid': () => import('../routes/use-cases/mutual-aid').then(m => m.default),
  '/use-cases/artists': () => import('../routes/use-cases/artists').then(m => m.default),
  '/use-cases/indigenous': () => import('../routes/use-cases/indigenous').then(m => m.default),
};

export async function getRouteHandler(path: string): Promise<RouteHandler | null> {
  const loader = routeMap[path];
  if (!loader) return null;
  const handler = await loader();
  return handler as RouteHandler;
} 