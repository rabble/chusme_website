import { renderLayout } from '../../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <h1>Use Case: Mutual Aid Organizers</h1>
    <p>Holis supports mutual aid groups in coordinating efforts, sharing resources, and making collective decisions securely.</p>
    <hr>
    <h2>Example Organizers</h2>
    <ul>
      <li>Juliette</li>
      <li>Maggie</li>
    </ul>
    <hr>
    <p>Empower your community to help each other, without relying on centralized platforms.</p>
  `;

  const html = renderLayout({
    title: "Use Case: Mutual Aid Organizers - Holis",
    description: "Holis supports mutual aid groups in coordinating efforts, sharing resources, and making collective decisions securely.",
    content
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
} 