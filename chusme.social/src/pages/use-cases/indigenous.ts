import { renderLayout } from '../../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <h1>Use Case: Indigenous & Cultural Groups</h1>
    <p>Chusme provides a safe, private, and community-owned platform for indigenous and cultural groups to organize, communicate, and sustain their communities.</p>
    <hr>
    <h2>Example Groups</h2>
    <ul>
      <li>Kaye-Maree</li>
    </ul>
    <hr>
    <p>Protect your culture and community with digital sovereignty.</p>
  `;

  const html = renderLayout({
    title: "Use Case: Indigenous & Cultural Groups - Chusme",
    description: "Chusme provides a safe, private, and community-owned platform for indigenous and cultural groups to organize, communicate, and sustain their communities.",
    content
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
} 