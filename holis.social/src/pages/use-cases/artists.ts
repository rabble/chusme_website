import { renderLayout } from '../../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <h1>Use Case: Event & Artist Collectives</h1>
    <p>Chusme enables artist and event collectives to plan, communicate, and fund projects together, all in a private and community-owned space.</p>
    <hr>
    <h2>Example Collectives</h2>
    <ul>
      <li>Leyl</li>
      <li>Preston</li>
    </ul>
    <hr>
    <p>Collaborate and create without platform lock-in or ads.</p>
  `;

  const html = renderLayout({
    title: "Use Case: Event & Artist Collectives - Chusme",
    description: "Chusme enables artist and event collectives to plan, communicate, and fund projects together, all in a private and community-owned space.",
    content
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
} 