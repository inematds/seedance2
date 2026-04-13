import type { Context } from "@netlify/functions";
import { createHmac } from "node:crypto";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default async (req: Request, _ctx: Context): Promise<Response> => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return new Response(JSON.stringify({ pro: false }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  const allowlist = (Netlify.env.get("PRO_EMAILS") || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allowlist.includes(email)) {
    return new Response(JSON.stringify({ pro: false }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  const secret = Netlify.env.get("PRO_TOKEN_SECRET");
  if (!secret) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }

  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const payload = `${email}.${expiresAt}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  const token = `${Buffer.from(payload).toString("base64url")}.${signature}`;

  return new Response(
    JSON.stringify({
      pro: true,
      token,
      expiresAt,
    }),
    { status: 200, headers: CORS_HEADERS }
  );
};

export const config = {
  path: ["/api/check-email", "/.netlify/functions/check-email"],
};
