# Android App Integration Guide for Plur

## 1. Generate App Signing Certificate Fingerprint
- Get your app's signing certificate SHA256 fingerprint using this command:
  ```bash
  keytool -list -v -keystore your-keystore.jks -alias your-key-alias
  ```
- Look for the "SHA256" value in the output
- Update the `.well-known/assetlinks.json` file with this value by contacting the gateway administrator

## 2. Configure Intent Filter in AndroidManifest.xml
- Open your app's `AndroidManifest.xml`
- Add the following intent filters to your main activity:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">
    
    <!-- Existing intent filters... -->
    
    <!-- App Links -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="rabble.community"
            android:pathPattern="/i/*" />
    </intent-filter>
    
    <!-- Join Path -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="rabble.community"
            android:pathPattern="/join/*" />
    </intent-filter>
    
    <!-- Join Community -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="rabble.community"
            android:pathPattern="/join-community.*" />
    </intent-filter>
    
    <!-- Group Path -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="https"
            android:host="rabble.community"
            android:pathPattern="/g/*" />
    </intent-filter>
    
    <!-- Custom URL Scheme -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="plur"
            android:host="join-community" />
    </intent-filter>
    
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:scheme="plur"
            android:host="group" />
    </intent-filter>
</activity>
```

## 3. Handle Deep Links in Your Activity

Implement the deep link handling in your MainActivity:

```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Handle the deep link if the activity was started with one
        handleIntent(intent)
    }
    
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        // Handle the deep link when the app is already open
        handleIntent(intent)
    }
    
    private fun handleIntent(intent: Intent) {
        val action = intent.action
        val data = intent.data
        
        if (Intent.ACTION_VIEW == action && data != null) {
            Log.d("DeepLink", "Handling deep link: $data")
            
            val host = data.host ?: ""
            val path = data.path ?: ""
            val scheme = data.scheme ?: ""
            
            // Handle rabble.community universal links
            if (host == "rabble.community") {
                when {
                    // Handle /i/ links (invites)
                    path.startsWith("/i/") -> {
                        val remainingPath = path.substring(3)
                        
                        // Check if it's an embedded protocol URL
                        if (remainingPath.startsWith("plur://")) {
                            handleProtocolUrl(remainingPath)
                        } else {
                            // Regular invite code - fetch from API
                            fetchInviteFromApi(remainingPath)
                        }
                    }
                    
                    // Handle /join/ links
                    path.startsWith("/join/") -> {
                        val pathSegments = data.pathSegments
                        if (pathSegments.size >= 2) {
                            val groupId = pathSegments[1]
                            val code = data.getQueryParameter("code") ?: ""
                            val relay = data.getQueryParameter("relay")?.let { URLDecoder.decode(it, "UTF-8") } ?: ""
                            
                            processGroupJoin(groupId, relay, code)
                        }
                    }
                    
                    // Handle /join-community links
                    path.startsWith("/join-community") -> {
                        val groupId = data.getQueryParameter("group-id") ?: return
                        val code = data.getQueryParameter("code") ?: ""
                        val relay = data.getQueryParameter("relay")?.let { URLDecoder.decode(it, "UTF-8") } ?: ""
                        
                        processGroupJoin(groupId, relay, code)
                    }
                    
                    // Handle /g/ links (direct group navigation)
                    path.startsWith("/g/") -> {
                        val pathSegments = data.pathSegments
                        if (pathSegments.size >= 2) {
                            val groupId = pathSegments[1]
                            val relay = data.getQueryParameter("relay")?.let { URLDecoder.decode(it, "UTF-8") } ?: ""
                            
                            navigateToGroup(groupId, relay)
                        }
                    }
                }
            }
            // Handle plur:// custom URL scheme
            else if (scheme == "plur") {
                when (host) {
                    "join-community" -> {
                        val groupId = data.getQueryParameter("group-id") ?: return
                        val code = data.getQueryParameter("code") ?: ""
                        val relay = data.getQueryParameter("relay")?.let { URLDecoder.decode(it, "UTF-8") } ?: ""
                        
                        processGroupJoin(groupId, relay, code)
                    }
                    "group" -> {
                        val pathSegments = data.pathSegments
                        if (pathSegments.isNotEmpty()) {
                            val groupId = pathSegments[0]
                            val relay = data.getQueryParameter("relay")?.let { URLDecoder.decode(it, "UTF-8") } ?: ""
                            
                            navigateToGroup(groupId, relay)
                        }
                    }
                }
            }
        }
    }
    
    // Handle protocol URL (plur://) embedded in universal links
    private fun handleProtocolUrl(urlString: String) {
        try {
            val uri = Uri.parse(urlString)
            
            val groupId = uri.getQueryParameter("group-id") ?: return
            val code = uri.getQueryParameter("code") ?: ""
            val relay = uri.getQueryParameter("relay")?.let { URLDecoder.decode(it, "UTF-8") } ?: ""
            
            processGroupJoin(groupId, relay, code)
        } catch (e: Exception) {
            Log.e("DeepLink", "Error parsing protocol URL: $e")
        }
    }
    
    // Fetch invite details from API for short codes
    private fun fetchInviteFromApi(code: String) {
        val apiUrl = "https://rabble.community/api/invite/$code"
        
        // Using OkHttp, Retrofit, or your preferred HTTP client
        val request = Request.Builder()
            .url(apiUrl)
            .build()
        
        OkHttpClient().newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("DeepLink", "API request failed: $e")
            }
            
            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    try {
                        val responseBody = response.body?.string() ?: return
                        val invite = Gson().fromJson(responseBody, InviteResponse::class.java)
                        
                        runOnUiThread {
                            processGroupJoin(invite.groupId, invite.relay, invite.code)
                        }
                    } catch (e: Exception) {
                        Log.e("DeepLink", "Error parsing API response: $e")
                    }
                }
            }
        })
    }
    
    // Join a group with the provided details
    private fun processGroupJoin(groupId: String, relay: String, code: String) {
        Log.d("DeepLink", "Processing group join - Group ID: $groupId, Relay: $relay, Code: $code")
        
        // Show group join UI
        val intent = Intent(this, GroupJoinActivity::class.java).apply {
            putExtra("GROUP_ID", groupId)
            putExtra("RELAY", relay)
            putExtra("CODE", code)
        }
        startActivity(intent)
    }
    
    // Navigate directly to a group
    private fun navigateToGroup(groupId: String, relay: String) {
        Log.d("DeepLink", "Navigating to group - Group ID: $groupId, Relay: $relay")
        
        // Navigate to group directly
        val intent = Intent(this, GroupActivity::class.java).apply {
            putExtra("GROUP_ID", groupId)
            putExtra("RELAY", relay)
        }
        startActivity(intent)
    }
}

// API response model
data class InviteResponse(
    val code: String,
    val groupId: String,
    val relay: String
)
```

## 4. Generate Invite Links

### Option A: Register Short Code Invites via API

```kotlin
fun registerNewInviteCode(groupId: String, relay: String, callback: (Result<String>) -> Unit) {
    val apiUrl = "https://rabble.community/api/invite"
    
    // Create JSON request
    val requestBody = JSONObject().apply {
        put("groupId", groupId)
        put("relay", relay)
    }
    
    val request = Request.Builder()
        .url(apiUrl)
        .header("Content-Type", "application/json")
        .header("X-Invite-Token", "YOUR_INVITE_TOKEN") // Replace with your actual token
        .post(requestBody.toString().toRequestBody("application/json".toMediaTypeOrNull()))
        .build()
    
    OkHttpClient().newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: IOException) {
            callback(Result.failure(e))
        }
        
        override fun onResponse(call: Call, response: Response) {
            if (response.isSuccessful) {
                val responseBody = response.body?.string() ?: return
                try {
                    val createResponse = Gson().fromJson(responseBody, InviteCreateResponse::class.java)
                    callback(Result.success(createResponse.code))
                } catch (e: Exception) {
                    callback(Result.failure(e))
                }
            } else {
                callback(Result.failure(IOException("API request failed with code ${response.code}")))
            }
        }
    })
}

// Response model for created invites
data class InviteCreateResponse(
    val code: String,
    val url: String
)

// Example usage
fun createAndShareInvite(groupId: String, relay: String) {
    registerNewInviteCode(groupId, relay) { result ->
        result.onSuccess { code ->
            // Share the registered invite link
            val shortUrl = "https://rabble.community/i/$code"
            shareUrl(shortUrl)
        }.onFailure { error ->
            Log.e("Invite", "Failed to create invite: $error")
            // Fallback to direct protocol URL
            val fallbackUrl = generateDirectInviteLink(groupId, generateRandomCode(), relay)
            if (fallbackUrl != null) {
                shareUrl(fallbackUrl)
            }
        }
    }
}
```

### Option B: Generate Direct Protocol URLs

```kotlin
fun generateDirectInviteLink(groupId: String, code: String, relay: String): String? {
    val encodedRelay = URLEncoder.encode(relay, "UTF-8")
    
    // Create the protocol URL
    val protocolUrl = "plur://join-community?group-id=$groupId&code=$code&relay=$encodedRelay"
    
    // Embed it in a universal link
    return "https://rabble.community/i/$protocolUrl"
}

// Generate random code
fun generateRandomCode(length: Int = 8): String {
    val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return (1..length)
        .map { chars.random() }
        .joinToString("")
}

// Share URL
fun shareUrl(url: String) {
    val sendIntent: Intent = Intent().apply {
        action = Intent.ACTION_SEND
        putExtra(Intent.EXTRA_TEXT, "Join my group on Plur! $url")
        type = "text/plain"
    }
    
    val shareIntent = Intent.createChooser(sendIntent, "Share invite link")
    startActivity(shareIntent)
}
```

## 5. Testing App Links

1. Install the app on your device (debug or release version)
2. Verify the digital asset links using this command:
   ```bash
   adb shell am start -a android.intent.action.VIEW -d "https://rabble.community/assetlinks.json"
   ```
3. Test each of the URL formats:
   - Short code: `https://rabble.community/i/CODE`
   - Embedded protocol: `https://rabble.community/i/plur://join-community?group-id=X&code=Y&relay=Z`
   - Join path: `https://rabble.community/join/GROUP_ID?code=CODE&relay=RELAY`
   - Join-community: `https://rabble.community/join-community?group-id=GROUP_ID&code=CODE&relay=RELAY`
   - Group path: `https://rabble.community/g/GROUP_ID?relay=RELAY`
   - Custom scheme: `plur://join-community?group-id=GROUP_ID&code=CODE&relay=RELAY`

## 6. Debugging Tips

- For App Links verification issues, check the logcat with:
  ```bash
  adb logcat -v brief | grep -E "IntentFilter|BROWSER"
  ```

- Add verbose logging to trace the processing of deep links:
  ```kotlin
  Log.d("DeepLink", "URI scheme: ${data.scheme}, Host: ${data.host}, Path: ${data.path}")
  data.queryParameterNames.forEach { param ->
      Log.d("DeepLink", "Query param: $param = ${data.getQueryParameter(param)}")
  }
  ```

- Create test links with different formats and save them as bookmarks to quickly test on your device

- Check if your app is actually being verified for App Links:
  ```bash
  adb shell dumpsys package domain-preferred-apps
  ```