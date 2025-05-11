import { renderLayout } from '../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <h1>Use the Chusme App</h1>
    
    <p>Chusme is available today on the web — and soon on desktop and mobile too. Whether you're organizing a grassroots campaign, a local club, or a global network, Chusme gives you the tools to communicate, coordinate, and fund your community — on your own terms.</p>
    
    <hr>
    
    <h2>🌐 Web App (Available Now)</h2>
    
    <p>You can use Chusme directly in your browser — no download required.</p>
    
    <p>
      ➡️ <strong><a href="https://chusme.app">Launch the Web App → chusme.app</a></strong><br>
      ➡️ <strong><a href="/get-started">View the Get Started Guide</a></strong>
    </p>
    
    <p>It works on desktop and mobile browsers, and supports:</p>
    <ul>
      <li>Creating and joining groups</li>
      <li>Group chat, events, announcements</li>
      <li>Community funds and feature unlocks</li>
      <li>Privacy-first messaging</li>
    </ul>
    
    <hr>
    
    <h2>📲 Mobile Apps (Coming Soon)</h2>
    
    <p>We're currently testing native mobile apps — optimized for fast alerts, secure messaging, and smooth onboarding.</p>
    
    <p>Coming soon to:</p>
    <ul>
      <li><strong>Android</strong> (via Google Play)</li>
      <li><strong>iOS</strong> (via the App Store)</li>
    </ul>
    
    <p>
      ➡️ <strong>Join our <a href="https://chusme.social#waitlist">email waitlist</a></strong> to get early access<br>
      ➡️ <strong>Follow <a href="https://social.nos.dev/@chusme">@chusme@social.nos.dev</a></strong> for development updates
    </p>
    
    <hr>
    
    <h2>🖥️ Desktop Apps</h2>
    
    <p>Prefer a dedicated app on your computer? You can download the beta versions for macOS and Windows:</p>
    
    <p>
      - <strong><a href="https://downloads.chusme.social/Chusme.dmg">Download for macOS</a></strong><br>
      - <strong><a href="https://downloads.chusme.social/ChusmeSetup.exe">Download for Windows</a></strong>
    </p>
    
    <p>These apps offer:</p>
    <ul>
      <li>Notification support</li>
      <li>Local data caching</li>
      <li>A clean interface for power users and stewards</li>
    </ul>
    
    <hr>
    
    <h2>Why We Offer Multiple Options</h2>
    
    <p>Chusme is built on open protocols like <a href="https://nostr.com">Nostr</a>, so <strong>your group's data isn't tied to one app</strong>.<br>
    You can move between web, desktop, and mobile without losing your identity, messages, or connections.</p>
    
    <p>We believe community infrastructure should be <strong>flexible, portable, and user-owned</strong>.</p>
    
    <hr>
    
    <h2>Questions?</h2>
    
    <p>If you're having trouble accessing the app, installing software, or connecting to a group, check out our:</p>
    
    <p>
      ➡️ <a href="https://github.com/verse/chusme/wiki">Support & Docs</a><br>
      ➡️ <a href="https://chusme.app/group/chusme-support">Community Chat</a><br>
      ➡️ <a href="mailto:support@chusme.social">Contact Us</a>
    </p>
  `;

  const html = renderLayout({
    title: "Use the Chusme App",
    description: "Download and use Chusme on web, mobile, and desktop to organize, communicate, and fund your community.",
    content
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}