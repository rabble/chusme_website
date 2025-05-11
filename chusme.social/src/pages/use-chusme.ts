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

    <div class="screenshot-grid">
      <div class="screenshot">
        <img src="/static/assets/ios/posts_screen.jpg" alt="Chusme posts screen" class="mobile-screenshot" />
        <p>Posts & Updates</p>
      </div>
      <div class="screenshot">
        <img src="/static/assets/ios/chat.jpg" alt="Chusme chat interface" class="mobile-screenshot" />
        <p>Group Chat</p>
      </div>
      <div class="screenshot">
        <img src="/static/assets/ios/events.jpg" alt="Chusme events calendar" class="mobile-screenshot" />
        <p>Events Calendar</p>
      </div>
    </div>

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
      ➡️ <strong>iOS TestFlight: <a href="https://testflight.apple.com/join/q7JHM4qg">Get Beta Access</a></strong><br>
      ➡️ <strong>Join our <a href="https://chusme.social#waitlist">email waitlist</a></strong> for Android early access<br>
      ➡️ <strong>Follow <a href="https://social.nos.dev/@chusme">@chusme@social.nos.dev</a></strong> for development updates
    </p>

    <div class="feature-section">
      <div class="feature-content">
        <h3>iOS Beta Testing</h3>
        <p>Our iOS beta is available through TestFlight. Try out the native mobile experience with push notifications and optimized performance.</p>
        <p><a href="https://testflight.apple.com/join/q7JHM4qg" class="btn">Join iOS TestFlight</a></p>
      </div>
      <img src="/static/assets/ios/group_list.jpg" alt="Chusme iOS interface" class="mobile-screenshot">
    </div>
    
    <hr>
    
    <h2>🖥️ Desktop Apps</h2>

    <p>Prefer a dedicated app on your computer? You can download the beta version for macOS:</p>

    <p>
      - <strong><a href="https://files.chusme.social/chusme.dmg">Download for macOS</a></strong>
    </p>

    <div class="feature-section">
      <div class="feature-content">
        <h3>Mac Beta Now Available</h3>
        <p>Our macOS beta version is ready for testing! Download the DMG file and drag the app to your Applications folder to get started.</p>
        <p><a href="https://files.chusme.social/chusme.dmg" class="btn">Download Mac Beta</a></p>
      </div>
      <img src="/static/assets/ios/posts_screen.jpg" alt="Chusme desktop interface" class="mobile-screenshot">
    </div>

    <p>These desktop apps offer:</p>
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
      ➡️ <a href="https://github.com/verse-pbc/plur/wiki">Support & Docs</a><br>
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