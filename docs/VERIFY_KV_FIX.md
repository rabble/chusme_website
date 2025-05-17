# Verifying the KV Binding Fix

## Manual Verification Steps

After applying the fix to add the `INVITES` KV namespace binding to the Cloudflare Pages project, use these steps to verify that it's working correctly:

### 1. Test the Specific Failing Link

Visit the previously failing link directly:
```
https://hol.is/i/ZHA65MN2
```

If the fix was successful, instead of seeing an error message about "KV namespace INVITES is not configured", you should either:
- Be redirected to the Plur mobile app (if installed)
- See a proper invite page or app download prompt (if mobile app not installed)

### 2. Test the Create Invite Endpoint

If you have access to the API token, you can test invite creation:

```bash
curl -X POST https://hol.is/api/invites \
  -H "Authorization: Bearer YOUR_INVITE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"groupId":"test-group","relay":"wss://relay.example.com"}'
```

A successful response should look like:
```json
{
  "code": "ABCD1234",
  "url": "https://hol.is/i/ABCD1234"
}
```

### 3. Test the /i/ Endpoint Directly

Create a test invite and then check if it can be retrieved:

1. First create an invite using the API
2. Then test accessing it: `https://hol.is/i/[CODE]`

### 4. Check Cloudflare Logs

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** > **hol-is**
3. Go to **Functions** > **Logs**
4. Look for logs that contain:
   - "KV namespace INVITES is not configured" (should no longer appear)
   - Successful invite lookups in the logs

## Automated Monitoring

Consider implementing these monitoring solutions to prevent future binding issues:

1. **Health Check Endpoint**: Add a dedicated `/health` endpoint that checks KV availability
2. **Synthetic Monitoring**: Set up regular pings to test critical flows that depend on KV
3. **Logging Alerts**: Configure alerts for specific error patterns in the logs

## Fallback to Test Invites

If you still encounter issues, remember you can always use the test invite creation endpoint for testing:

```
https://hol.is/create-test-invite/{groupId}/{relay}
```

This creates a functional deep link that works without requiring KV access, useful for development and debugging. 