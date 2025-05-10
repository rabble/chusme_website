# iOS App Integration Guide for Plur

## 1. Update App Identifier & Team ID
- Ensure your app's bundle identifier is `app.verse.prototype.plur`
- Verify your Team ID is `GZCZBKH7MY`
- These must match what's configured in the `apple-app-site-association` file

## 2. Enable Associated Domains
- Open your Xcode project
- Go to your app target's "Signing & Capabilities" tab
- Click "+" and add "Associated Domains" capability
- Add the entry: `applinks:rabble.community`
- Also add: `webcredentials:rabble.community`

## 3. Handle Universal Links

In your `AppDelegate.swift` or `SceneDelegate.swift`, implement the URL handling method:

```swift
// Handle Universal Links (from website)
func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    if userActivity.activityType == NSUserActivityTypeBrowsingWeb, let url = userActivity.webpageURL {
        return handleDeepLink(url)
    }
    return false
}

// Handle Custom URL Scheme (plur://)
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return handleDeepLink(url)
}

// Unified deep link handler
func handleDeepLink(_ url: URL) -> Bool {
    print("Handling deep link: \(url)")
    
    // Handle rabble.community universal links
    if url.host == "rabble.community" {
        // Handle /i/ format (invites)
        if url.path.hasPrefix("/i/") {
            let pathComponent = String(url.path.dropFirst(3))
            
            // Handle embedded protocol URL
            if pathComponent.hasPrefix("plur://") {
                return handleProtocolURL(pathComponent)
            }
            
            // Handle simple invite code
            else {
                return fetchInviteFromAPI(code: pathComponent)
            }
        }
        
        // Handle /join/ format
        else if url.path.hasPrefix("/join/") {
            let components = url.pathComponents
            guard components.count >= 3 else { return false }
            
            let groupId = components[2]
            let queryItems = URLComponents(url: url, resolvingAgainstBaseURL: true)?.queryItems ?? []
            let params = queryItems.reduce(into: [String: String]()) { $0[$1.name] = $1.value }
            
            let relay = params["relay"]?.removingPercentEncoding ?? ""
            let code = params["code"] ?? ""
            
            return processGroupJoin(groupId: groupId, relay: relay, code: code)
        }
        
        // Handle /join-community format
        else if url.path.hasPrefix("/join-community") {
            let queryItems = URLComponents(url: url, resolvingAgainstBaseURL: true)?.queryItems ?? []
            let params = queryItems.reduce(into: [String: String]()) { $0[$1.name] = $1.value }
            
            guard let groupId = params["group-id"] else { return false }
            let relay = params["relay"]?.removingPercentEncoding ?? ""
            let code = params["code"] ?? ""
            
            return processGroupJoin(groupId: groupId, relay: relay, code: code)
        }
        
        // Handle /g/ format (direct group navigation)
        else if url.path.hasPrefix("/g/") {
            let components = url.pathComponents
            guard components.count >= 3 else { return false }
            
            let groupId = components[2]
            let queryItems = URLComponents(url: url, resolvingAgainstBaseURL: true)?.queryItems ?? []
            let params = queryItems.reduce(into: [String: String]()) { $0[$1.name] = $1.value }
            
            let relay = params["relay"]?.removingPercentEncoding ?? ""
            
            return navigateToGroup(groupId: groupId, relay: relay)
        }
    }
    
    // Handle plur:// custom URL scheme
    else if url.scheme == "plur" {
        if url.host == "join-community" {
            return handleProtocolURL(url.absoluteString)
        }
        else if url.host == "group" {
            let components = url.pathComponents
            guard components.count >= 2 else { return false }
            
            let groupId = components[1]
            let queryItems = URLComponents(url: url, resolvingAgainstBaseURL: true)?.queryItems ?? []
            let params = queryItems.reduce(into: [String: String]()) { $0[$1.name] = $1.value }
            
            let relay = params["relay"]?.removingPercentEncoding ?? ""
            
            return navigateToGroup(groupId: groupId, relay: relay)
        }
    }
    
    return false
}

// Handle plur:// protocol URLs
func handleProtocolURL(_ urlString: String) -> Bool {
    print("Handling protocol URL: \(urlString)")
    
    guard let queryStartIndex = urlString.firstIndex(of: "?") else { return false }
    let queryPart = String(urlString[queryStartIndex...])
    
    if let components = URLComponents(string: queryPart) {
        let params = components.queryItems?.reduce(into: [String: String]()) { $0[$1.name] = $1.value } ?? [:]
        
        guard let groupId = params["group-id"] else { return false }
        let relay = params["relay"]?.removingPercentEncoding ?? ""
        let code = params["code"] ?? ""
        
        return processGroupJoin(groupId: groupId, relay: relay, code: code)
    }
    
    return false
}

// Fetch invite details from API for short codes
func fetchInviteFromAPI(code: String) -> Bool {
    let apiURL = URL(string: "https://rabble.community/api/invite/\(code)")!
    
    URLSession.shared.dataTask(with: apiURL) { [weak self] data, response, error in
        guard let self = self, let data = data, error == nil else { return }
        
        do {
            let invite = try JSONDecoder().decode(InviteResponse.self, from: data)
            DispatchQueue.main.async {
                _ = self.processGroupJoin(groupId: invite.groupId, relay: invite.relay, code: invite.code)
            }
        } catch {
            print("Failed to decode invite: \(error)")
        }
    }.resume()
    
    return true
}

// Process joining a group
func processGroupJoin(groupId: String, relay: String, code: String) -> Bool {
    print("Processing group join - Group ID: \(groupId), Relay: \(relay), Code: \(code)")
    
    // Your app's group join implementation
    DispatchQueue.main.async {
        let joinVC = GroupJoinViewController(groupId: groupId, relay: relay, code: code)
        UIApplication.shared.windows.first?.rootViewController?.present(joinVC, animated: true)
    }
    
    return true
}

// Navigate directly to a group
func navigateToGroup(groupId: String, relay: String) -> Bool {
    print("Navigating to group - Group ID: \(groupId), Relay: \(relay)")
    
    // Your app's direct group navigation
    DispatchQueue.main.async {
        let groupVC = GroupViewController(groupId: groupId, relay: relay)
        UIApplication.shared.windows.first?.rootViewController?.present(groupVC, animated: true)
    }
    
    return true
}

// API response model
struct InviteResponse: Decodable {
    let code: String
    let groupId: String
    let relay: String
}
```

## 4. Generate Invite Links

### Option A: Register Short Code Invites via API

```swift
// Create and register a new invite code with the server
func registerNewInviteCode(groupId: String, relay: String, completion: @escaping (Result<String, Error>) -> Void) {
    let apiURL = URL(string: "https://rabble.community/api/invite")!
    var request = URLRequest(url: apiURL)
    request.httpMethod = "POST"
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
    
    // Add your invite token - this is your API authentication token
    request.addValue("YOUR_INVITE_TOKEN", forHTTPHeaderField: "X-Invite-Token")
    
    // Prepare JSON body
    let body: [String: Any] = [
        "groupId": groupId,
        "relay": relay
    ]
    
    do {
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
    } catch {
        completion(.failure(error))
        return
    }
    
    // Make the request
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }
        
        guard let data = data else {
            completion(.failure(NSError(domain: "NoData", code: 0)))
            return
        }
        
        do {
            let response = try JSONDecoder().decode(InviteResponse.self, from: data)
            completion(.success(response.code))
        } catch {
            completion(.failure(error))
        }
    }.resume()
}

// Response model for created invites
struct InviteCreateResponse: Decodable {
    let code: String
    let url: String
}
```

### Option B: Generate Direct Protocol URLs

```swift
// Generate a direct protocol URL without API registration
func generateDirectInviteLink(groupId: String, code: String, relay: String) -> URL? {
    // Create the protocol URL
    guard let encodedRelay = relay.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
        return nil
    }
    
    // Create the universal link with embedded protocol URL
    let protocolURL = "plur://join-community?group-id=\(groupId)&code=\(code)&relay=\(encodedRelay)"
    let universalLink = "https://rabble.community/i/\(protocolURL)"
    
    return URL(string: universalLink)
}

// Generate a random code
func generateRandomCode(length: Int = 8) -> String {
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return String((0..<length).map { _ in letters.randomElement()! })
}

// Share an invite link
func shareInviteLink(groupId: String, relay: String) {
    // Generate a random code or use existing one
    let code = generateRandomCode()
    
    if let inviteURL = generateDirectInviteLink(groupId: groupId, code: code, relay: relay) {
        let activityVC = UIActivityViewController(
            activityItems: ["Join my group on Plur!", inviteURL],
            applicationActivities: nil
        )
        
        UIApplication.shared.windows.first?.rootViewController?.present(activityVC, animated: true)
    }
}
```

## 5. Custom URL Scheme Setup

Add the custom URL scheme to your Info.plist:

1. Open Info tab in Xcode
2. Add a URL Type with:
   - Identifier: `app.verse.prototype.plur`
   - URL Schemes: `plur`
   - Role: Viewer

## 6. Testing

1. Deploy your app to a physical device (not simulator)
2. Test each of these URL formats:
   - Short code: `https://rabble.community/i/CODE`
   - Embedded protocol: `https://rabble.community/i/plur://join-community?group-id=X&code=Y&relay=Z`
   - Join path: `https://rabble.community/join/GROUP_ID?code=CODE&relay=RELAY`
   - Join-community: `https://rabble.community/join-community?group-id=GROUP_ID&code=CODE&relay=RELAY`
   - Group path: `https://rabble.community/g/GROUP_ID?relay=RELAY`
   - Custom scheme: `plur://join-community?group-id=GROUP_ID&code=CODE&relay=RELAY`

For debugging, add a Safari bookmark with the test URLs on your device to quickly test them.