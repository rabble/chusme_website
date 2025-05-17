import { renderLayout } from '../layout';
export default async function handler(request) {
    const content = `
    <h1>Privacy Policy</h1>

    <p>Holis is a social app for building authentic human connections within communities.</p>

    <h2>Our commitments</h2>

    <p>We are committed to:</p>
    <ul>
      <li>Create a social app with less abuse and harassment by design</li>
      <li>Minimize centralized data collection and respect our user's privacy</li>
      <li>Empowering users to control what they see and how they want to see it</li>
      <li>You owning your identity so you can move to another service if you don't like ours</li>
    </ul>

    <p>Unlike other social apps which are designed to turn your private information into revenue, our goal is to collect as little information about you as we practically can, and make money by providing services that you actually want to use.</p>

    <p>However, there is some information that we have to collect—and some that we'd like to collect with your permission—in order for our service to work as well as possible.</p>

    <p>In this Privacy Policy, we explain what information we collect, store and when we share it. We also explain the controls you have over your data and how you can delete it.</p>

    <h2>TLDR</h2>

    <p>We strongly recommend that you read this policy in full, but just in case you don't have time, here are a few things we want to make sure everyone knows:</p>

    <ul>
      <li>Holis is not designed for children and if you're under 16 you can't sign up. This is both because of laws in the EU and the US and also because we take our responsibility to protect children seriously.</li>

      <li>All social networks are about sharing your updates and information with other people and Holis is no exception. If you write a post on Holis it will be, by default, visible to your community and other people will be able to see it, react to it and share it with other people.</li>

      <li>Holis is built using the Nostr protocol which distributes your posts to a multitude of relays of your choosing. This means—as with email and the web—that no one company can own or control the whole thing. And again, just like with e-mail, it means people may view your content on apps that we didn't design and store it on servers that we don't control. Always remember, as with anything you put on the internet, someone may choose to keep a copy of what you've said.</li>

      <li>While we recommend you use your real name so your friends can find you, we don't require that you do so. If you'd rather use a pseudonym or your non-legal name, that's fine too.</li>

      <li>We collect some information about how people use the app so that we can spot problems, bugs and determine the usage of features. Generally, we do that in an anonymized fashion. If there are exceptions they're listed explicitly in this document. Our feeling is that we don't need to know people's names to track that lots of people like a feature or are having a problem.</li>

      <li>There is some information that we receive automatically including your IP address. We can't do much about this—it's how the internet works—but we try to keep it to a minimum.</li>

      <li>If you have questions about this policy, what information we collect and how we use it, or anything else related to your data or privacy, you can contact us by mail or over the internet at any time. We want to hear from you!</li>
    </ul>

    <h2>Your data on Distributed Social Networks</h2>

    <p>Holis is built on a technology called Nostr and works a bit differently from existing social media apps. It's important that you understand the differences.</p>

    <p>Most social media apps are run by one company and all your information is stored on their servers.</p>

    <p>With Holis and Nostr, all your publicly shared content is stored on multiple relays of your choosing. Anyone can run a relay. When you open Holis, it will search the relays in the network to see if there are new posts from the people in your communities.</p>

    <p>Other users can read or interact with your posts using any compatible piece of software.</p>

    <p>In some ways, it's a bit like email. Anyone can run a server or build an app and messages and posts will move between them, no matter which app they were written on or which company made it.</p>

    <p>It's these differences that mean that the network can't be owned or controlled exclusively by any one company, it's why it's a true and open public space, it's why it's possible for any organization to build an app to access the network, and it's why it's resistant to centralized data collection and advertising. It also means, just like with email, that people may view your content on apps that we didn't design and store it on servers that we don't control.</p>

    <p>It's important to remember that while we can delete things for you from our servers, as with anything you put out on the public Internet, we can't stop people keeping a copy or record of what you've said or shared elsewhere.</p>

    <h2>Information you share with Holis</h2>

    <h3>Basic account information:</h3>

    <p>If you want to use Holis, there's some information we as a company have to collect. This includes your Display Name (how you want people to see you on the network), and your 'public identifier' (a cryptographic key, similar to a bitcoin wallet address, which is the way you are technically identified on the network). There are some other bits of information that are stored on your phone which we intentionally don't have access to - for example your 'private key' (which is like your password). If you lose that, we can't recover it, so back it up!</p>

    <h3>Things that you post in public:</h3>

    <p>Once you've created an account on Holis, you will have a public profile that anyone can see if they know your 'public identifier' (basically your address). During sign-up you can choose to enhance that profile by writing a short bio, choosing a photo to represent yourself, or by adding links to your other social media profiles. You can change any of this information by following the links on your Profile page.</p>

    <p>When you write a post it will be—by default—visible to your community and possibly public and visible to anyone who knows its address as well as to anyone who is following you or part of your groups.</p>

    <p>Each of your public posts contains more than just the content of your message. It also includes your Display name, a link to your profile, your 'public identifier' and the time the post was created. The same applies when you write a reply to someone else's post.</p>

    <p>In addition the people you follow and who follow you, and the posts that you 'like' are all public information.</p>

    <p>Again, please be careful about what you post on Holis - particularly when you're giving out sensitive information. We can update our servers when you edit your profile information, and we can delete things at your request, but we can't stop other people keeping a copy or record of the things you've said or shared.</p>

    <h3>Changing your Settings</h3>

    <p>You can change your bio, your avatar image and any links you may have to other social media products on your profile at any time by going to your profile screen and tapping on the 'Edit' button.</p>

    <h3>Deleting your content</h3>

    <p>You can delete any post you make on Holis by tapping on the menu on the post. The way deletion works on a Distributed Social Network is that we remove your content from our relays and tell all the other relays that you use that they should remove your post too. Please remember though—as with all other internet products—once you've put something out there we can't stop people keeping a copy or a record of what you've said.</p>

    <h3>Taking your identity to another service</h3>

    <p>We are committed to make it easy for you to take your content, friends and all your account details to another Nostr-compatible service or app if you don't like Holis or our policies. To transfer to another service, all you need is your public identifier and your private key. You can access those via the Settings menu. When you put these into another Nostr client, that app will look online for all the content you've created and attempt to rebuild your account automatically.</p>

    <h2>Other information we may receive</h2>

    <p>Beyond the limited amount of information we need for legal reasons and the content you create in public—which will most likely be replicated on our servers—we make considerable efforts to not collect vast stores of information about you or the things you interact with. However there is some information we need to be able to operate Holis.</p>

    <h3>App Analytics and Error Reporting</h3>

    <p>By default, Holis keeps log data of people's use of the app and the device that it's running on as well as when there's a crash or error reported. We use this data so that we can see how the app is functioning, spot problems and know which parts of the service people use or don't use. We keep this information anonymized though - our feeling is that we don't need to know your name to track that lots of people like a feature or are having a problem.</p>

    <h3>Information from Abuse or Bug Reports</h3>

    <p>On occasion you may choose to file a report of abusive behavior or a bug on Holis. In those circumstances we keep the content of your report, a log of the problem or a copy of the content being reported, as well as your name, public identifier and contact details so we can respond to your concern. It's possible that someone else may report your content for abuse or harassment or as a violation of our rules. If that happens, we will keep a record of that complaint along with any associated content for our records.</p>

    <h2>When we share your information</h2>

    <p>Again, our goal is to collect as little information about you as we practically can, and make money by providing services that you actually want to use. But there is some data sharing that is necessary for us to run Holis.</p>

    <h3>As a normal part of running a Distributed Social Network</h3>

    <p>Again, Holis works fundamentally differently to mainstream social media. That means that your public content will get automatically 'replicated' to servers that we don't own or control. This is core to making it an open environment—a true public—that no one company can control. In many ways this is more similar to how the web works (you can build a webpage that is public and can be accessed by a variety of different browsers made by different people) or how email works (you send a message that travels across different servers run by different people, and can be read on a variety of applications) than it is to how services like Twitter or Facebook work.</p>

    <h3>As necessary with third-party services we use to operate Holis</h3>

    <p>We use a variety of third-party services to help us operate our services. We use tools like Slack to manage our work, services like Posthog to manage analytics and our bug and abuse reporting, and services provided by companies like Google to help us host our servers. We may share your private personal data with service providers like these in the course of our work subject to obligations consistent with this Privacy Policy and any other appropriate confidentiality and security measures, and on the condition that these third parties use your private personal data only on our behalf and pursuant to our instructions.</p>

    <h3>When reasonably required by law or government</h3>

    <p>Whatever else it says in this Privacy Policy, if we believe it is reasonably necessary to save, use or disclose your personal data to comply with laws, regulations, legal processes or governmental requests, then we will do so. The same applies if we think it's reasonably necessary to protect someone's safety or to protect them from fraud, or to keep our services secure, or to stop abusive, malicious or spamming behavior on our platform. However, nothing in this Privacy Policy is intended to limit any legal defenses or objections that you may have to a third party's—including a government's—request to disclose your personal data.</p>

    <h3>If there's a Change in Ownership</h3>

    <p>We have to bear in mind the possibility that the company at some point might go bankrupt, merge with another company, be acquired, or its assets might be sold. Under such circumstances, the limited personal data we store about you may be sold or transferred as part of that transaction. This Privacy Policy will still apply to your personal data.</p>

    <h2>How to manage your information</h2>

    <h3>Changing your personal data</h3>

    <p>You can change your profile data by going to your profile page in the app and tapping on 'Edit Profile'. You can change your profile image on the same screen.</p>

    <h3>Deleting your information or your account</h3>

    <p>You can delete any post you've written at any time. As always, remember that while we can remove this content from your log, from our servers and from our applications, we can't stop someone else keeping a copy of what you've written. Deleting the application from your phone will not remove your content from the Internet, and if you lose your private key, you may not be able to ever remove it - so please be careful and keep a back-up of it. If you want to delete your account completely, you can do so from your Settings screen. This will remove all the written content from your log, leaving only some basic metadata as a record, will remove your content from the Holis app, and will instruct other servers and applications that you want your content to be removed too. Just remember, again, that much like anything you publish on the internet, we can't stop someone else from retaining a copy of what you've written. If you find they are doing that, many jurisdictions allow you to contact them directly and require them to remove your content if requested. We retain information collected for analytics or error reporting purposes for a maximum of 18 months.</p>

    <h3>Data portability</h3>

    <p>One of our core commitments is to make it easy for you to move your identity to another service if you decide you don't like ours. To do this, access your private key from your Settings menu. Copy that key and input it into a compatible Nostr-based application and then delete the Holis application from your phone.</p>

    <h2>Children</h2>

    <p>We want Holis to be a free and open environment for adults, and just like in the real world, that means on occasion that some parts of it might not be suitable for children. The law in many countries recognizes this too as well as indicating that children under sixteen may not be old enough to understand the consequences - and legally consent - to the processing of their personal data. For these reasons, we do not allow children under sixteen to use Holis.</p>

    <h2>Global operations</h2>

    <p>Holis is operated in the United States and our servers are located there. Where the laws of your country allow you to do so, you authorize us to transfer, store and use the data we've described above in the United States and any other country where we operate. Remember as always that Holis works as part of a Distributed Social Network where anyone can run a server or build an app to access it. Just like with email, your content and log data will leave our servers and be replicated to people who request or access it, wherever they are in the world.</p>

    <h2>Changes to this Privacy Policy</h2>

    <p>On occasion it's necessary for us to revise this Privacy Policy to keep it up to date with what we're doing and the law. The most current version of the policy is always the one that describes how we handle your personal data and will always be available at https://holis.social/privacy. If we make a change to this policy that in our discretion is material, we will notify you within the Holis application or via your contact details. Sorry in advance for the legalese, but by continuing to access your account or use any of Holis's services after those changes become effective, you agree to be bound by the revised Privacy Policy.</p>

    <p>Contact us if you have questions about this Privacy Policy, what information we collect and how it is used and distributed - or anything else related to your data or privacy, you can contact us at any time. Our e-mail address is support@holis.social.</p>
  `;
    const html = renderLayout({
        title: "Privacy Policy - Holis",
        description: "Privacy policy and data practices for Holis social app",
        content
    });
    return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
    });
}
