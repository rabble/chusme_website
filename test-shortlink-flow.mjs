import fetch from 'node-fetch';

const BASE_URL = 'https://hol.is';
const INVITE_TOKEN = process.env.INVITE_TOKEN; // Set this in your environment

async function createInvite(groupId, relay) {
  const res = await fetch(`${BASE_URL}/api/invites`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${INVITE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ groupId, relay })
  });
  if (!res.ok) throw new Error(`Failed to create invite: ${await res.text()}`);
  return res.json();
}

async function createShortUrl(code) {
  const res = await fetch(`${BASE_URL}/api/shorturl`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${INVITE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  });
  if (!res.ok) throw new Error(`Failed to create short URL: ${await res.text()}`);
  return res.json();
}

async function followRedirect(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    redirect: 'manual'
  });
  return {
    status: res.status,
    location: res.headers.get('location'),
    body: await res.text()
  };
}

async function main() {
  const groupId = 'debug-group';
  const relay = 'wss://relay.example.com';

  // 1. Create invite
  const invite = await createInvite(groupId, relay);
  console.log('Invite created:', invite);

  // 2. Create short URL
  const short = await createShortUrl(invite.code);
  console.log('Short URL created:', short);

  // 3. Test short URL redirect
  const shortRes = await followRedirect(`/j/${short.shortCode}`);
  console.log('Short URL redirect:', shortRes);

  // 4. Test full invite URL redirect
  const inviteRes = await followRedirect(`/i/${invite.code}`);
  console.log('Full invite URL redirect:', inviteRes);

  // 5. Check if the short URL ultimately leads to the correct deep link
  if (shortRes.status === 302 && shortRes.location.endsWith(`/i/${invite.code}`)) {
    console.log('Short URL correctly resolves to full invite URL.');
  } else {
    console.error('Short URL did not resolve as expected.');
  }

  // 6. Check if the full invite URL redirects to the deep link
  if (inviteRes.status === 302 && inviteRes.location.startsWith('plur://')) {
    console.log('Full invite URL correctly redirects to deep link.');
  } else {
    console.error('Full invite URL did not redirect to deep link as expected.');
  }
}

main().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
}); 