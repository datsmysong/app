import { CookieSerializeOptions } from "@fastify/cookie";
import { createServerClient } from "@supabase/ssr";
import { Database } from "commons/database-types";
import { FastifyReply, FastifyRequest } from "fastify";

export default function createClient(context: {
  request: FastifyRequest;
  response: FastifyReply;
}) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable"
    );
  }

  return createServerClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key: string) => {
          const cookies = context.request.cookies;
          const cookie = cookies[key] ?? "";
          return decodeURIComponent(cookie);
        },
        set: (key: string, value: string, options: CookieSerializeOptions) => {
          if (!context.response) return;
          context.response.cookie(key, encodeURIComponent(value), {
            ...options,
            sameSite: "lax",
            httpOnly: true,
          });
        },
        remove: (key: string, options: CookieSerializeOptions) => {
          if (!context.response) return;
          context.response.cookie(key, "", { ...options, httpOnly: true });
        },
      },
    }
  );
}
