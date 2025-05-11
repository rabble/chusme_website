import { renderLayout } from '../layout';
export default async function handler(request) {
    // Since we can't easily render React components with the current setup,
    // we'll use the same approach as other pages with HTML content
    const content = `
    <h1>Organize your community. On your terms.</h1>
    <p>Chusme is a community-powered platform to message, plan, fund, and grow — without ads, algorithms, or fear of being shut down.</p>
    <p>We help groups unlock tools, coordinate with their members, and sustain themselves collectively.</p>
    <p><a href="https://chusme.app" class="btn">Launch the App</a> <a href="/how-it-works">Learn How It Works</a></p>

    <div class="screenshot-grid">
      <div class="screenshot">
        <img src="/static/assets/ios/group_list.jpg" alt="Chusme groups" class="mobile-screenshot" />
        <p>Community Spaces</p>
      </div>
      <div class="screenshot">
        <img src="/static/assets/ios/posts_screen.jpg" alt="Chusme posts" class="mobile-screenshot" />
        <p>Group Updates</p>
      </div>
      <div class="screenshot">
        <img src="/static/assets/ios/events.jpg" alt="Chusme events" class="mobile-screenshot" />
        <p>Event Planning</p>
      </div>
    </div>

    <hr>
    <h2>Why Chusme?</h2>
    <ul>
      <li>Facebook deletes groups with no warning</li>
      <li>Slack is built for companies, not communities</li>
      <li>WhatsApp floods conversations with no structure</li>
      <li>Surveillance platforms monetize every message</li>
    </ul>
    <p><strong>Chusme is different.</strong><br>We give you control, privacy, and a community fund you govern together.</p>
    <hr>
    <h2>What Makes Chusme Different</h2>
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

    <div class="feature-section">
      <div class="feature-content">
        <h3>Private Messaging & Coordination</h3>
        <p>Chat privately with individuals or create encrypted group channels for sensitive coordination.</p>
        <p>Perfect for organizing events, mutual aid, or community activism.</p>
      </div>
      <img src="/static/assets/ios/chat.jpg" alt="Chat interface" class="mobile-screenshot">
    </div>

    <div class="feature-section">
      <img src="/static/assets/ios/asks_offers.jpg" alt="Asks and offers interface" class="mobile-screenshot">
      <div class="feature-content">
        <h3>Resource Sharing</h3>
        <p>Post asks and offers to share resources within your community.</p>
        <p>Whether it's skills, tools, or support, connect resources with needs in your group.</p>
      </div>
    </div>

    <hr>
    <h2>Built for Organizers Like You</h2>
    <blockquote>"We had 300,000 people in our Facebook group. One day it was gone."<br>— Cressida, community organizer</blockquote>
    <blockquote>"We needed to alert students during an ICE raid. Facebook didn't reach them. Signal didn't scale. So we built Chusme."<br>— @rabble</blockquote>
    <blockquote>"Feels like WhatsApp — but with community ownership and care."<br>— Kaye-Maree, Māori organizer</blockquote>
    <hr>
    <h2>Ready to organize your community?</h2>
    <p>Start a space, invite your people, and unlock tools together. Chusme is free, open, and built for you.</p>

    <div class="feature-section">
      <div class="feature-content">
        <h3>Community Fund & Contributions</h3>
        <p>Groups can pool resources for shared needs, events, or to compensate organizers.</p>
        <p>Every contribution stays with your community — members decide how funds are used.</p>
      </div>
      <img src="/static/assets/ios/zaps.jpg" alt="Community fund interface" class="mobile-screenshot">
    </div>

    <p><a href="/get-started" class="btn">Get Started</a> <a href="https://chusme.app">Launch the App</a></p>
  `;
    const html = renderLayout({
        title: "Organize your community. On your terms.",
        description: "Chusme is a community-powered platform to message, plan, fund, and grow — without ads, algorithms, or fear of being shut down.",
        content
    });
    return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
    });
}
