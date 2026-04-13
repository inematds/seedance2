// LOCAL-ONLY: Proxy para renderizar video via fal.ai ou kie.ai.
// A chave API vem no body (do localStorage do browser, configurada no modal Settings).
//
// Não usa OAuth do Claude aqui — essa chamada é puramente um proxy HTTP
// entre o browser e a API do provider de vídeo. O servidor só faz proxy
// para evitar CORS (muitas APIs bloqueiam calls diretos do browser).
//
// Submete o job e retorna request_id + status_url. O polling é
// responsabilidade do usuário (abre status_url em nova aba).
//
// NOTE: This is a V1 stub. Full polling + storage of the resulting video
// is planned for v2.

import type { VercelRequest, VercelResponse } from "@vercel/node";

// ─────────────────────────────────────────────────────────────
// Provider configs
// ─────────────────────────────────────────────────────────────

// fal.ai Seedance 2.0 endpoint (queue-based, async).
// Docs: https://fal.ai/models/fal-ai/bytedance/seedance/v1/pro/text-to-video/api
const FAL_ENDPOINT = "https://queue.fal.run/fal-ai/bytedance/seedance/v1/pro/text-to-video";

// kie.ai endpoint (synchronous or queue-based depending on model).
// Docs: https://kie.ai/docs (verify actual URL pattern)
const KIE_ENDPOINT = "https://api.kie.ai/v1/seedance/generate";

// ─────────────────────────────────────────────────────────────
// Rate limiting
// ─────────────────────────────────────────────────────────────

const ipBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // render is expensive — lower limit
const WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const key = `render:${ip}`;
  const bucket = ipBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    ipBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (bucket.count >= RATE_LIMIT) return true;
  bucket.count++;
  return false;
}

// ─────────────────────────────────────────────────────────────
// Provider calls
// ─────────────────────────────────────────────────────────────

async function submitToFal(prompt: string, apiKey: string) {
  const response = await fetch(FAL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      // Optional params fal.ai accepts:
      // aspect_ratio: "16:9",
      // duration: "10s",
      // enable_safety_checker: true,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const msg =
      (data as any)?.detail ||
      (data as any)?.error ||
      `fal.ai HTTP ${response.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  // fal.ai queue response shape:
  // { request_id, status, status_url, response_url, ... }
  return {
    provider: "fal",
    requestId: (data as any).request_id,
    statusUrl: (data as any).status_url,
    responseUrl: (data as any).response_url,
  };
}

async function submitToKie(prompt: string, apiKey: string) {
  // kie.ai shape may differ — this is a best-effort implementation.
  // Adjust once we test against the real API.
  const response = await fetch(KIE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model: "seedance-2.0-pro",
      duration: 10,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const msg =
      (data as any)?.error?.message ||
      (data as any)?.message ||
      `kie.ai HTTP ${response.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  // kie.ai response shape (best guess — verify in testing):
  return {
    provider: "kie",
    requestId: (data as any).id || (data as any).job_id,
    statusUrl: (data as any).status_url || null,
    videoUrl: (data as any).video_url || (data as any).url || null,
  };
}

// ─────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  setCors(res);

  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const forwarded = (req.headers["x-forwarded-for"] as string) || "";
  const ip = forwarded.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    res.status(429).json({ error: "Rate limit exceeded — 3 renders per minute per IP" });
    return;
  }

  let body: { prompt?: string; provider?: string; apiKey?: string };
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body as typeof body) || {};
  } catch {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const prompt = (body.prompt || "").trim();
  const provider = (body.provider || "fal").toLowerCase();
  const apiKey = (body.apiKey || "").trim();

  if (!prompt) { res.status(400).json({ error: "No prompt provided" }); return; }
  if (!apiKey) {
    res.status(400).json({
      error:
        "No API key provided. Configure it in the Settings modal (⚙️ button in the navbar).",
    });
    return;
  }
  if (provider !== "fal" && provider !== "kie") {
    res.status(400).json({ error: "Invalid provider. Use 'fal' or 'kie'." });
    return;
  }

  try {
    const result =
      provider === "fal"
        ? await submitToFal(prompt, apiKey)
        : await submitToKie(prompt, apiKey);

    console.log(
      `[render-local] provider=${provider} requestId=${result.requestId || "?"}`
    );

    res.status(200).json(result);
  } catch (err: any) {
    const msg = err?.message || String(err);
    console.error(`[render-local] ${provider} error:`, msg);
    res.status(502).json({ error: `${provider}.ai: ${msg}` });
  }
}
