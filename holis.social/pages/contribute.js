import { renderLayout } from '../layout';
export default async function handler(request) {
    const content = `
    <h1>Contribute to Holis</h1>
    
    <p>Holis isn't a startup.<br>
    It's a commons — built with and for the organizers who use it.</p>
    
    <p>You can contribute by sharing feedback, funding your group's tools, helping improve the code, or running infrastructure to support others. Every contribution strengthens the ecosystem.</p>
    
    <hr>
    
    <h2>🧑‍🤝‍🧑 Organizers: Help Shape the Platform</h2>
    
    <p>We're building Holis in close collaboration with mutual aid groups, tenant unions, cultural collectives, indigenous organizers, and volunteer communities.</p>
    
    <p>You can contribute by:</p>
    <ul>
      <li>Giving feedback on features, flows, and language</li>
      <li>Helping design onboarding experiences for real-world groups</li>
      <li>Co-writing community guides and norms templates</li>
      <li>Running workshops or interviews to gather insight from your network</li>
    </ul>
    
    <p>This isn't just "user feedback" — it's co-design. We build what organizers ask for, not what a product team imagines.</p>
    
    <p>
      ➡️ <a href="mailto:team@Holis.social">Talk to the Holis team</a><br>
      ➡️ <a href="https://app.holis.social/group/Holis-co-design">Join our co-design sessions</a>
    </p>
    
    <hr>
    
    <h2>💸 Financial Contributions</h2>
    
    <p>Holis is free to use.<br>
    But like a community radio station or food coop, we rely on voluntary contributions to sustain it.</p>
    
    <p>You can:</p>
    <ul>
      <li>Contribute personally to Holis's core development</li>
      <li>Donate to your group's community fund</li>
      <li>Help unlock features like video hosting, public websites, or encrypted tools</li>
      <li>Fund moderators, interpreters, facilitators, and group leaders</li>
    </ul>
    
    <p>Every group on Holis manages its own fund — and decides how to spend it together.</p>
    
    <p>
      ➡️ <a href="https://app.holis.social/contribute">Support a Group</a><br>
      ➡️ <a href="https://opencollective.com/aos-collective">Contribute to Holis Development</a>
    </p>
    
    <hr>
    
    <h2>💻 Developers: Build With Us</h2>
    
    <p>Holis is <a href="https://github.com/verse-pbc/plur">open source</a> and built with interoperability in mind.</p>
    
    <p>Ways to contribute:</p>
    <ul>
      <li>Improve core Holis components (messaging, UI, privacy features)</li>
      <li>Build custom onboarding flows, extensions, or bots</li>
      <li>Create tools for accessibility, moderation, or group governance</li>
      <li>File bugs, review issues, and help with documentation</li>
    </ul>
    
    <p>We welcome contributors of all experience levels.</p>
    
    <p>
      ➡️ <a href="https://github.com/verse-pbc/plur">View the GitHub repo</a><br>
      ➡️ <a href="https://app.holis.social/group/Holis-dev">Join the dev chat</a>
    </p>
    
    <hr>
    
    <h2>🌐 Host a Relay or Mirror</h2>
    
    <p>Holis uses <a href="https://nostr.com">Nostr</a> — an open protocol for distributed communication.</p>
    
    <p>This means:</p>
    <ul>
      <li>Your group can be mirrored across multiple relays</li>
      <li>You can host your own relay to control data and latency</li>
      <li>We don't own your group — you do</li>
    </ul>
    
    <p>If you want to host a community relay:</p>
    <ul>
      <li>We'll help you get started with open-source tools</li>
      <li>You can serve just your group or many</li>
      <li>You'll be contributing to the resilience of the Holis network</li>
    </ul>
    
    <p>➡️ <a href="https://github.com/fiatjaf/relay29/blob/master/README.md">Relay Hosting Guide with NIP-29 Support</a></p>
    
    <hr>
    
    <h2>🧠 Contributions We Value</h2>
    
    <p>Whether you're a steward, a coder, a designer, or a facilitator, we need you.</p>
    
    <table>
      <tr>
        <th>Role</th>
        <th>Ways to Contribute</th>
      </tr>
      <tr>
        <td>Community Organizer</td>
        <td>Test features, co-design flows, write onboarding posts</td>
      </tr>
      <tr>
        <td>Developer</td>
        <td>Submit pull requests, debug, or build plugins</td>
      </tr>
      <tr>
        <td>Writer/Translator</td>
        <td>Help with copy, documentation, and multilingual access</td>
      </tr>
      <tr>
        <td>Infra Hacker</td>
        <td>Run a relay, self-host the app, build bridges to other tools</td>
      </tr>
      <tr>
        <td>Educator</td>
        <td>Create community guides, videos, or onboarding materials</td>
      </tr>
    </table>
    
    <hr>
    
    <h2>✨ A Community-Owned Platform</h2>
    
    <p>We're building Holis so that it can't be bought, sold, or shut down.<br>
    The more we all contribute — time, insight, resources, code — the more resilient the ecosystem becomes.</p>
    
    <p>Whether you're starting a neighborhood group or helping shape internet protocols, there's a place for you here.</p>
    
    <p>
      ➡️ <a href="https://app.holis.social">Join the Movement → Launch the App</a><br>
      ➡️ <a href="/about">Read About the Vision</a>
    </p>
  `;
    const html = renderLayout({
        title: "Contribute to Holis",
        description: "Contribute to Holis by sharing feedback, funding your group's tools, helping improve the code, or running infrastructure.",
        content
    });
    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
