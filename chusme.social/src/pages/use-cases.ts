import { renderLayout } from '../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <h1>Use Cases</h1>

    <p>Chusme is being co-designed with a wide range of community organizers who are testing it in early pilot phases. These collaborators are helping shape every part of the platform — from onboarding flows to moderation systems, from privacy features to fundraising tools.</p>

    <p>They're not just early adopters.<br>
    They're co-creators of the digital infrastructure they want to use.</p>

    <div class="use-case-grid">
      <div class="use-case-card">
        <div class="use-case-emoji">🏘️</div>
        <h3>Tenant Organizers & Housing Justice Networks</h3>
        <p>We're working with tenant organizers developing secure communication tools for their networks.</p>
        <div class="use-case-list">
          <ul>
            <li>Encrypted group coordination channels</li>
            <li>Emergency alerts (like eviction defense mobilizations)</li>
            <li>Decision-making tools for campaign planning</li>
            <li>Transparent management of pooled community funds</li>
          </ul>
        </div>
        <div class="use-case-link">
          <a href="/use-cases/tenants">Learn more about tenant organizing →</a>
        </div>
      </div>

      <div class="use-case-card">
        <div class="use-case-emoji">🤝</div>
        <h3>Mutual Aid Groups & Volunteer Collectives</h3>
        <p>From local mutual aid pods to regional relief efforts, we're learning from groups that coordinate:</p>
        <div class="use-case-list">
          <ul>
            <li>Deliveries and ride shares</li>
            <li>Needs requests and offers of support</li>
            <li>Shared ledgers for accountability</li>
            <li>Rotating stewardship models and non-hierarchical facilitation</li>
          </ul>
        </div>
        <div class="use-case-link">
          <a href="/use-cases/mutual-aid">Explore mutual aid solutions →</a>
        </div>
      </div>

      <div class="use-case-card">
        <div class="use-case-emoji">🎛️</div>
        <h3>Cultural Creatives & Event Organizers</h3>
        <p>We're co-designing with artists and event crews organizing everything from community raves to storytelling festivals.</p>
        <div class="use-case-list">
          <ul>
            <li>Real-time event coordination across roles</li>
            <li>RSVP and reminder tools</li>
            <li>Shared scheduling and venue communication</li>
            <li>Non-corporate ways to stay in touch after the event</li>
          </ul>
        </div>
        <div class="use-case-link">
          <a href="/use-cases/artists">See how artists use Chusme →</a>
        </div>
      </div>

      <div class="use-case-card">
        <div class="use-case-emoji">🌱</div>
        <h3>Indigenous & Cultural Stewardship Networks</h3>
        <p>We're collaborating with cultural leaders and indigenous digital stewards looking for better tools.</p>
        <div class="use-case-list">
          <ul>
            <li>Safer alternatives to commercial messaging apps</li>
            <li>Tools that support intergenerational communication</li>
            <li>Digital infrastructure that aligns with their governance values</li>
            <li>The option to host and own their own data</li>
          </ul>
        </div>
        <div class="use-case-link">
          <a href="/use-cases/indigenous">Discover indigenous-led projects →</a>
        </div>
      </div>

      <div class="use-case-card">
        <div class="use-case-emoji">🐴</div>
        <h3>Large Online Communities Looking for Autonomy</h3>
        <p>Some of our co-designers run massive online spaces that have been threatened or erased by platform takedowns.</p>
        <div class="use-case-list">
          <ul>
            <li>Moderation tools that scale without centralization</li>
            <li>User-controlled visibility for posts and updates</li>
            <li>Familiar-feeling spaces that are actually owned by the community</li>
          </ul>
        </div>
      </div>
    </div>

    <h2>Built With Organizers, Not Just For Them</h2>

    <p>These use cases aren't hypothetical — they come from real-world organizers who are helping us test and shape Chusme in live pilot environments.</p>

    <p>We're still in early development and learning fast.</p>

    <div class="cta-box">
      <h3>Want to collaborate on a pilot?</h3>
      <p>Work with us to build tools that fit your community's unique needs and values.</p>
      <a href="mailto:team@chusme.social" class="btn">Contact the Chusme Team</a>
      <a href="https://chusme.app" class="btn">Launch the App</a>
    </div>

    <h2>Coming Soon</h2>

    <p>As the platform matures, we'll publish deeper stories about how groups are using Chusme to organize — anonymously when needed, and proudly when they choose.</p>

    <p>In the meantime, you can:</p>

    <div class="next-steps">
      <a href="https://github.com/verse/chusme" class="next-step-item">
        <span class="next-step-icon">🔍</span>
        <span class="next-step-text">Follow development on GitHub</span>
      </a>
      <a href="/about" class="next-step-item">
        <span class="next-step-icon">📝</span>
        <span class="next-step-text">Read our values in the About section</span>
      </a>
      <a href="https://chusme.app" class="next-step-item">
        <span class="next-step-icon">🚀</span>
        <span class="next-step-text">Start your own space via chusme.app</span>
      </a>
    </div>
  `;

  const html = renderLayout({
    title: "Use Cases - Chusme",
    description: "Explore how community organizers, tenant unions, mutual aid groups, and more are using Chusme to communicate, coordinate, and grow.",
    content
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}