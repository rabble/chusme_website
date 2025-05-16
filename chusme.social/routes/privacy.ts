export default async function handler(): Promise<Response> {
  try {
    // @ts-ignore
    const privacyController = await import('../pages/privacy.js');
    return privacyController.default({ method: 'GET' });
  } catch (error) {
    console.error('Error handling privacy route:', error);
    return new Response('Error loading privacy page', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}