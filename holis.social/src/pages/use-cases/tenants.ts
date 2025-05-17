import { renderLayout } from '../../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <h1>Use Case: Tenant Unions & Housing Justice</h1>
    <p>Holis helps tenant unions and housing justice organizers coordinate, communicate securely, and pool resources for collective action.</p>
    <hr>
    <h2>Example Groups</h2>
    <ul>
      <li>KC Tenants</li>
      <li>Rhodes</li>
    </ul>
    <hr>
    <p>Organize for housing justice with privacy and digital sovereignty.</p>
  `;

  const html = renderLayout({
    title: "Use Case: Tenant Unions & Housing Justice - Holis",
    description: "Holis helps tenant unions and housing justice organizers coordinate, communicate securely, and pool resources for collective action.",
    content
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
} 