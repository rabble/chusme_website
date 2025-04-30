var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-FlCqG1/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/index.ts
var ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateCode(length = 8) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  }
  return result;
}
__name(generateCode, "generateCode");
var STATIC_FILES = {
  "/.well-known/assetlinks.json": {
    content: JSON.stringify([{
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "community.rabble",
        sha256_cert_fingerprints: ["YOUR_APP_FINGERPRINT_HERE"]
      }
    }]),
    contentType: "application/json"
  },
  "/apple-app-site-association": {
    content: JSON.stringify({
      applinks: {
        apps: [],
        details: [{
          appID: "YOUR_TEAM_ID.community.rabble",
          paths: ["/i/*"]
        }]
      }
    }),
    contentType: "application/json"
  }
};
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    if (pathname in STATIC_FILES) {
      const file = STATIC_FILES[pathname];
      return new Response(file.content, {
        status: 200,
        headers: { "Content-Type": file.contentType }
      });
    }
    if (pathname === "/api/invite" && request.method === "POST") {
      const token = request.headers.get("X-Invite-Token");
      if (!token || token !== env.INVITE_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
      }
      let body;
      try {
        body = await request.json();
      } catch {
        return new Response("Invalid JSON body", { status: 400 });
      }
      const { groupId, relay } = body;
      if (typeof groupId !== "string" || typeof relay !== "string") {
        return new Response("Missing groupId or relay", { status: 400 });
      }
      const code = generateCode();
      await env.INVITES.put(code, JSON.stringify({ groupId, relay }));
      return new Response(
        JSON.stringify({ code, url: `https://rabble.community/i/${code}` }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    if (pathname.startsWith("/api/invite/") && request.method === "GET") {
      const parts = pathname.split("/");
      const code = parts[parts.length - 1];
      const record = await env.INVITES.get(code, { type: "json" });
      if (!record) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(
        JSON.stringify({ code, ...record }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    if (pathname.startsWith("/i/")) {
      const code = pathname.split("/")[2];
      const record = await env.INVITES.get(code, { type: "json" });
      if (!record) {
        return new Response("<h1>Invite not found</h1>", {
          status: 404,
          headers: { "Content-Type": "text/html;charset=UTF-8" }
        });
      }
      const html = '<!DOCTYPE html><html lang="en"><head>  <meta charset="UTF-8" />  <meta name="viewport" content="width=device-width, initial-scale=1.0">  <title>Join Rabble Community</title>  <style>    body { font-family: sans-serif; margin: 2rem; }    #avatar { width: 64px; height: 64px; border-radius: 32px; margin-bottom: 1rem; }    #actions button {       margin-right: 1rem;       margin-bottom: 1rem;      padding: 0.5rem 1rem;       font-size: 1rem;      background-color: #4a86e8;      color: white;      border: none;      border-radius: 4px;      cursor: pointer;    }    #actions button:hover {      background-color: #3a76d8;    }    .container {      max-width: 500px;      margin: 0 auto;      text-align: center;    }  </style></head><body>  <div class="container">    <div id="preview">      <img id="avatar" src="" hidden />      <h1 id="name">Loading\u2026</h1>      <p id="desc"></p>    </div>    <div id="actions">      <button id="open-app">Open in App</button>      <button id="install-app">Install App</button>      <button id="continue-web">Continue in Browser</button>    </div>  </div>  <script>    const CODE = "' + code + '";    const GROUP = "' + record.groupId + '";    const RELAY = "' + record.relay + '";    async function fetchGroupMeta() {      const ws = new WebSocket(RELAY);      ws.onopen = () => {        ws.send(JSON.stringify([          "REQ",          "sub_" + CODE,          { "#e": [GROUP] }        ]));      };      ws.onmessage = e => {        try {          const [, , event] = JSON.parse(e.data);          const meta = JSON.parse(event.content);          document.getElementById("name").textContent = meta.name || "Unnamed Group";          document.getElementById("desc").textContent = meta.about || "";          if (meta.picture) {            const img = document.getElementById("avatar");            img.src = meta.picture;            img.hidden = false;          }          ws.close();        } catch (err) {          console.error("Failed to parse event", err);        }      };    }    document.getElementById("open-app").onclick = () => {      window.location =         "rabble://join-community?group-id=" + GROUP +         "&code=" + CODE +         "&relay=" + encodeURIComponent(RELAY);    };    document.getElementById("install-app").onclick = () => {      window.location =         "https://apps.apple.com/app/idYOUR_APP_ID?link=https://rabble.community/i/" + CODE;    };    document.getElementById("continue-web").onclick = () => {      window.location =         "https://app.rabble.community/?joinCode=" + CODE +         "&groupId=" + GROUP +         "&relay=" + encodeURIComponent(RELAY);    };    fetchGroupMeta();  <\/script></body></html>';
      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }
    return new Response("Not found", { status: 404 });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-FlCqG1/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-FlCqG1/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
