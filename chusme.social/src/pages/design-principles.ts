import { renderLayout } from '../layout';

export default async function handler(request: Request): Promise<Response> {
  const content = `
    <h1>Design Principles</h1>
    <p>Abstract guiding concepts that can shape Plur's development while still being grounded in real community steward experiences.</p>
    <h2>1. Community Before Scale</h2>
    <p>Communities thrive when they prioritize depth of connection over rapid growth. The goal of Plur should not be just maximizing user numbers but fostering meaningful engagement. As seen in Cressida's equestrian group, maintaining high standards of behavior led to a more supportive space—even at the cost of removing members​.</p>
    <p>→ Design for strong community cultures, not just audience growth.</p>
    <h2>2. Stewardship, Not Just Moderation</h2>
    <p>Healthy communities require active care, not just content policing. AI-driven moderation, like Facebook's AI Assist, has shown that automating enforcement without human context can backfire​. Community leaders act as stewards, guiding norms and fostering participation.</p>
    <p>→ Empower community leaders with tools that help them shape, not just police, discussions.</p>
    <h2>3. Ownership and Stability Over Virality</h2>
    <p>Social platforms often prioritize short-term engagement (likes, comments, trends) over long-term community resilience. Many community leaders, like Cressida and Josh, have struggled with platform volatility, unexpected shutdowns, and algorithm shifts​​.</p>
    <p>→ Build for longevity, ensuring communities can persist and evolve beyond algorithmic whims.</p>
    <h2>4. Participation is a Spectrum</h2>
    <p>Not all members engage in the same way—some lurk, some contribute occasionally, and some lead. Many platforms fail by focusing only on active users, leaving passive participants behind. Communities like Women Who Code found that informal interactions (e.g., icebreaker bots) helped passive members stay engaged​.</p>
    <p>→ Design for multiple levels of participation, from quiet observers to active organizers.</p>
    <h2>5. Make Contribution Frictionless</h2>
    <p>Communities often struggle with siloed financial transactions, unclear pathways to contribute, and reliance on external payment platforms​​. Whether it's monetary contributions, event RSVPs, or skill-sharing, reducing friction makes generosity easier.</p>
    <p>→ Foster a culture of giving by making contribution effortless, whether financial or social.</p>
    <h2>6. Conversation Should Be Navigable, Not Ephemeral</h2>
    <p>Many current platforms treat discussion as fleeting streams (WhatsApp, Slack, Telegram), making it hard to find important past conversations. Community leaders like Rachel struggled with vanishing or buried posts on Facebook​.</p>
    <p>→ Design for lasting, searchable, and structured conversations, not just fleeting updates.</p>
    <h2>7. Rituals Create Belonging</h2>
    <p>Successful communities develop repeated, meaningful interactions—from weekly check-ins to annual events. Groups like Juliette's birthday club and the Space Cowboys rave community built strong bonds through rituals that sustain engagement​​.</p>
    <p>→ Create spaces where communities can develop traditions that reinforce their identity.</p>
    <h2>8. Digital Spaces Should Support Real-World Connection</h2>
    <p>Online interactions should not replace, but strengthen real-world relationships. Whether it's local neighborhood groups, activist movements, or industry meetups, many stewards use digital tools as a bridge to offline events​​.</p>
    <p>→ Design digital tools that facilitate real-life impact, from small meetups to global activism.</p>
    <h2>9. Accessibility is More Than Usability</h2>
    <p>Communities exist across different cultures, languages, internet speeds, and tech literacy levels. Tools need to be simple enough for casual users yet powerful for advanced organizers. Community leaders like Kaye-Maree emphasized the need for low-barrier, mobile-first solutions that work even in rural areas​.</p>
    <p>→ Prioritize inclusivity in technology, ensuring it works for both digital natives and those with limited tech access.</p>
    <h2>Non-Negotiables</h2>
    <p>Based on extensive community steward research, the non-negotiable elements of Plur should align with the core values, needs, and frustrations expressed by community leaders. These elements ensure that Plur respects user agency, fosters trust, and enables meaningful connections.</p>
    <h3>1. Data Sovereignty & Platform Resilience</h3>
    <p>Communities should be able to export their data, have platform redundancy, and custom domains/branding.</p>
    <h3>2. End-to-End Encryption & Privacy First Architecture</h3>
    <p>All messages, voice/video calls, and private group chats must be encrypted by default. Decentralized or federated infrastructure, minimal data retention.</p>
    <h3>3. Community-First Moderation & Governance Tools</h3>
    <p>Community-defined rules & enforcement, flexible moderation levels, appeal process & transparency.</p>
    <h3>4. Multi-Tiered Participation & Role Management</h3>
    <p>Flexible access control, custom roles & permissions, anonymous & pseudonymous participation.</p>
    <h3>5. Asynchronous & Real-Time Communication Options</h3>
    <p>Persistent, thread-based discussions, live chat & voice options, event & meeting scheduling.</p>
    <h3>6. Financial Tools That Empower Community Growth</h3>
    <p>Built-in donations & micropayments, event ticketing & memberships, revenue transparency & compliance.</p>
    <h3>7. Discoverability Without Algorithmic Manipulation</h3>
    <p>Chronological + pinned content options, topic & tag-based organization, no engagement farming mechanics.</p>
    <h3>8. Interoperability & Open Ecosystem</h3>
    <p>API & integrations, federated identity options, exportability & backups.</p>
    <h2>Conclusion: What Plur Must Guarantee</h2>
    <p>At its core, Plur should be community-owned, privacy-first, and adaptable. The non-negotiables are about giving control back to community leaders while ensuring privacy, sustainability, and resilience.</p>
  `;

  const html = renderLayout({
    title: "Design Principles - Chusme",
    description: "Abstract guiding concepts that can shape Plur's development while still being grounded in real community steward experiences.",
    content
  });

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
} 