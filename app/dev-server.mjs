// Dev server standalone — serve public/ + roteia /api/generate
// Roda sem Vercel CLI. Uso: node dev-server.mjs (ou npm run dev:local)
//
// Requer: tsx (dev dep) para importar o api/generate.ts em runtime
// Env: carrega .env automaticamente se existir

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tsImport } from "tsx/esm/api";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "3030", 10);
const PUBLIC_DIR = path.join(__dirname, "public");
// API file can be overridden via env var (e.g., API_FILE=api/generate-local.ts for OAuth mode)
const API_FILE_REL = process.env.API_FILE || "api/generate.ts";
const API_FILE = path.join(__dirname, API_FILE_REL);

// ---------- Carrega .env ----------
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
  console.log("[dev-server] loaded .env");
}

// Modo local via OAuth (generate-local.ts) não precisa de .env
const IS_LOCAL_OAUTH = API_FILE_REL.includes("generate-local");
if (IS_LOCAL_OAUTH) {
  console.log("\x1b[35m[dev-server] MODO OAUTH LOCAL — usando ~/.claude/.credentials.json\x1b[0m");
  console.log("  Backed by your Claude Max/Pro subscription (zero cost per call)");
  console.log("  Shares rate limits with Claude Code CLI on this account\n");
} else if (
  !process.env.ANTHROPIC_API_KEY ||
  process.env.ANTHROPIC_API_KEY.startsWith("sk-ant-replace")
) {
  console.warn(
    "\n\x1b[33m⚠️  ANTHROPIC_API_KEY não configurada em .env\x1b[0m"
  );
  console.warn(
    "   O frontend abre normalmente, mas qualquer clique em 'Gerar' retorna 500.\n"
  );
  console.warn("   Para configurar:");
  console.warn("   1. cp .env.example .env");
  console.warn("   2. edite .env com sua chave (começa com sk-ant-)");
  console.warn("   3. reinicie este servidor");
  console.warn("");
  console.warn(
    "   \x1b[36mOU\x1b[0m: rode em modo OAuth local (sem API key):"
  );
  console.warn("     npm run dev:local\n");
}

// ---------- Carrega o handler da API via tsx ----------
let apiHandler = null;
console.log(`[dev-server] carregando ${API_FILE_REL}...`);
try {
  const mod = await tsImport(API_FILE, import.meta.url);
  // tsx faz double-wrap do default export — desempacotar
  apiHandler =
    typeof mod.default === "function"
      ? mod.default
      : typeof mod.default?.default === "function"
        ? mod.default.default
        : null;
  if (typeof apiHandler !== "function") {
    throw new Error(
      "api/generate.ts não exporta default function (encontrado: " +
        JSON.stringify(Object.keys(mod)) +
        " / default=" +
        typeof mod.default +
        ")"
    );
  }
  console.log("[dev-server] ✓ api/generate.ts carregado");
} catch (err) {
  console.error("[dev-server] ✗ erro ao carregar api/generate.ts:", err.message);
  console.error("   O frontend ainda vai carregar, mas a API retorna 500.");
}

// ---------- Wrappers para VercelRequest/VercelResponse ----------

function makeVercelRequest(req, body) {
  return {
    ...req,
    body: body,
    query: {},
    cookies: {},
    headers: req.headers,
    method: req.method,
    url: req.url,
  };
}

function makeVercelResponse(res) {
  const wrapped = {
    _status: 200,
    _headers: {},
    status(code) {
      wrapped._status = code;
      return wrapped;
    },
    setHeader(key, value) {
      res.setHeader(key, value);
      wrapped._headers[key] = value;
      return wrapped;
    },
    json(obj) {
      if (!res.headersSent) {
        res.writeHead(wrapped._status, { "Content-Type": "application/json" });
      }
      res.end(JSON.stringify(obj));
    },
    send(data) {
      if (!res.headersSent) {
        res.writeHead(wrapped._status);
      }
      res.end(typeof data === "string" ? data : JSON.stringify(data));
    },
    end(data) {
      if (!res.headersSent) {
        res.writeHead(wrapped._status);
      }
      res.end(data);
    },
  };
  return wrapped;
}

// ---------- Static file helpers ----------

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

function serveStatic(req, res) {
  let pathname = req.url.split("?")[0];
  if (pathname === "/") pathname = "/index.html";

  const filePath = path.join(PUBLIC_DIR, pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found: " + pathname);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";
  const body = fs.readFileSync(filePath);
  res.writeHead(200, {
    "Content-Type": mime,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

// ---------- HTTP server ----------

const server = http.createServer(async (req, res) => {
  const url = req.url || "/";

  // API route
  if (url.startsWith("/api/generate")) {
    if (!apiHandler) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "API handler not loaded — check server logs" }));
      return;
    }

    // ler body
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", async () => {
      let parsedBody;
      try {
        parsedBody = raw ? JSON.parse(raw) : {};
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
        return;
      }

      const vreq = makeVercelRequest(req, parsedBody);
      const vres = makeVercelResponse(res);
      try {
        await apiHandler(vreq, vres);
      } catch (err) {
        console.error("[dev-server] handler error:", err);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Handler threw: " + (err?.message || err) }));
        }
      }
    });
    return;
  }

  // Static files
  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log("\n\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m");
  console.log(`  🎬 \x1b[1mINEMA Prompt Engine\x1b[0m — dev server`);
  console.log("");
  console.log(`  \x1b[36mLocal:\x1b[0m   http://localhost:${PORT}`);
  console.log(`  \x1b[36mAPI:\x1b[0m     http://localhost:${PORT}/api/generate`);
  console.log(`  \x1b[36mModo:\x1b[0m    ${IS_LOCAL_OAUTH ? "OAuth (Max/Pro)" : "API key"}`);
  console.log("");
  console.log("  Ctrl+C para parar");
  console.log("\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n");
});
