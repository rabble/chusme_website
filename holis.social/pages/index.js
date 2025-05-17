import { renderLayout } from '../layout';
export default async function handler(request) {
    // Since we can't easily render React components with the current setup,
    // we'll use the same approach as other pages with HTML content
    const content = `
    <h1>Organize your community. On your terms.</h1>
    <p>Holis is a community-powered platform to message, plan, fund, and grow — without ads, algorithms, or fear of being shut down.</p>
    <p>We help groups unlock tools, coordinate with their members, and sustain themselves collectively.</p>
    <p><a href="https://app.holis.social" class="btn">Launch the App</a> <a href="/how-it-works">Learn How It Works</a></p>
    <hr>
    <h2>Why Holis?</h2>
    <ul>
      <li>Facebook deletes groups with no warning</li>
      <li>Slack is built for companies, not communities</li>
      <li>WhatsApp floods conversations with no structure</li>
      <li>Surveillance platforms monetize every message</li>
    </ul>
    <p><strong>Holis is different.</strong><br>We give you control, privacy, and a community fund you govern together.</p>
    <hr>
    <h2>What Makes Holis Different</h2>
    <div class="grid-features">
      <div>
        <h3>🌱 Community-owned</h3>
        <p>Built for groups, not growth hacks. You own your space and data.</p>
      </div>
      <div>
        <h3>🛡️ Private & Encrypted</h3>
        <p>End-to-end encrypted, metadata-light. Your conversations are yours.</p>
      </div>
      <div>
        <h3>🔓 Feature Unlocking</h3>
        <p>Fund the tools you need together. Unlock new features as a group.</p>
      </div>
      <div>
        <h3>📣 No Ads or Algorithms</h3>
        <p>Chronological, unfiltered, and yours. No engagement traps.</p>
      </div>
    </div>
    <hr>
    <h2>Built for Organizers Like You</h2>
    <blockquote>"We had 300,000 people in our Facebook group. One day it was gone."<br>— Cressida, community organizer</blockquote>
    <blockquote>"We needed to alert students during an ICE raid. Facebook didn't reach them. Signal didn't scale. So we built Holis."<br>— @rabble</blockquote>
    <blockquote>"Feels like WhatsApp — but with community ownership and care."<br>— Kaye-Maree, Māori organizer</blockquote>
    <hr>
    <h2>Ready to organize your community?</h2>
    <p>Start a space, invite your people, and unlock tools together. Holis is free, open, and built for you.</p>
    <p><a href="/get-started" class="btn">Get Started</a> <a href="https://Holis.app">Launch the App</a></p>
  `;
    const html = renderLayout({
        title: "Organize your community. On your terms.",
        description: "Holis is a community-powered platform to message, plan, fund, and grow — without ads, algorithms, or fear of being shut down.",
        content
    });
    return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
    });
}
