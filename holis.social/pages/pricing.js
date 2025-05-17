import { renderLayout } from '../layout';
export default async function handler(request) {
    const content = `
    <div class="main-content">
      <h1>Pricing</h1>

      <p><strong>Chusme isn't a SaaS product. It's a community-powered platform.</strong></p>

      <p>There's no paywall, no forced upgrade path, and no data monetization.<br>
      Instead, we follow a model rooted in <strong>solidarity, self-governance, and digital privacy</strong>.</p>

      <p>Inspired by mutual aid networks, community radio, and tech cooperatives, we believe:</p>

      <blockquote>Everyone contributes what they can — and no one gets left out.</blockquote>

      <hr>

      <h2>💸 How Chusme Groups Fund Themselves</h2>

      <p>Every group on Chusme has the option to raise funds together.<br>
      You can chip in to unlock tools, build shared infrastructure, and support the people doing the work.</p>

      <p>Funds are stored in a <strong>private, community-controlled wallet</strong> — using <a href="https://cashu.space">Cashu</a>, an open-source, privacy-preserving ecash protocol.</p>

      <hr>

      <h2>🔐 Why Cashu?</h2>

      <p>Cashu gives your group:</p>

      <ul>
        <li>⚡️ Fast, anonymous payments</li>
        <li>🏦 A shared group wallet — no bank needed</li>
        <li>🔄 Option to exchange for <strong>Bitcoin Lightning</strong> or local currencies</li>
        <li>🕵️‍♀️ No tracking, no account IDs, no blockchain surveillance</li>
      </ul>

      <p>There's:</p>
      <ul>
        <li>❌ No token</li>
        <li>❌ No mining</li>
        <li>❌ No speculative "web3" risk</li>
      </ul>

      <p>Just <strong>real, usable money</strong> — owned by your community, not by a platform.</p>

      <hr>

      <h2>🧩 What You Can Unlock</h2>

      <table class="pricing-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Suggested Contribution</th>
            <th>What It Enables</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>📹 Video hosting</td>
            <td>$15/month</td>
            <td>Upload onboarding calls, training videos, recaps</td>
          </tr>
          <tr>
            <td>🌐 Public website</td>
            <td>$10/month</td>
            <td>Publish a join page or update feed</td>
          </tr>
          <tr>
            <td>🧑‍💼 Custom usernames</td>
            <td>$5/month</td>
            <td>Handles like <code>@sofia@yourgroup.chusme.social</code></td>
          </tr>
          <tr>
            <td>🗳️ Proposal tools</td>
            <td>$5/month</td>
            <td>Vote on fund usage or big decisions</td>
          </tr>
          <tr>
            <td>🧾 Group accounting</td>
            <td>$10/month</td>
            <td>View contributors, balances, and past decisions</td>
          </tr>
        </tbody>
      </table>

      <p>Funds are pooled in your <strong>Cashu group wallet</strong>, and visible to trusted admins or the whole group, depending on your settings.</p>

      <hr>

      <h2>🤲 Voluntary, Not Mandatory</h2>

      <p>You don't have to pay to join or keep using Chusme.</p>

      <p><strong>If your community hosts your own relay, name server, and media server, you don't need to pay for any Chusme services.</strong> This is permissionless, free software — own your infrastructure, own your community.</p>

      <p>But if you believe in building alternatives to Big Tech —<br>
      if you want to support moderators, translators, and care workers —<br>
      if you want to fund tools that serve movements instead of metrics...</p>

      <p>Then this solidarity model is for you.</p>

      <hr>

      <h2>🛠 What You're Funding</h2>

      <p>Your contributions support:</p>
      <ul>
        <li>The features your group unlocks</li>
        <li>Your own group's community fund (e.g. pay a steward, buy supplies, translate docs)</li>
        <li>The broader Chusme ecosystem: development, hosting, support</li>
      </ul>

      <p>This keeps Chusme:</p>
      <ul>
        <li>Open source</li>
        <li>Community-driven</li>
        <li>Free from ads, VCs, and surveillance incentives</li>
      </ul>

      <hr>

      <h2>✨ Contribute in Any Way You Can</h2>

      <ul>
        <li>💸 Chip in to your group's fund via Cashu</li>
        <li>⚙️ Contribute code, designs, or feedback (<a href="https://github.com/verse-pbc/plur">GitHub</a>)</li>
        <li>🌍 Run a relay or a Cashu mint for your community</li>
        <li>🧠 Help other groups learn how to self-organize</li>
      </ul>

      <hr>

      <h2>Get Started</h2>

      <p>You can try Chusme for free — right now.<br>
      And when you're ready, unlock what you need, support your people, and keep your group sovereign.</p>

      <p>
        ➡️ <a href="https://app.holis.social">Launch the App → app.holis.social</a><br>
        ➡️ <a href="https://cashu.space">Read More About Cashu</a><br>
        ➡️ <a href="https://opencollective.com/aos-collective">Help us grow the commons → Open Collective</a>
      </p>
    </div>
  `;
    const html = renderLayout({
        title: "Pricing",
        description: "Chusme's community-driven funding model - no paywalls, no forced upgrades, just solidarity.",
        content
    });
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
