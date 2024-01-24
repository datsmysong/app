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
        get: (key: any) => {
          const cookies = context.request.cookies;
          const cookie = cookies[key] ?? "";
          return decodeURIComponent(cookie);
        },
        set: (key: any, value: any, options: any) => {
          if (!context.response) return;
          context.response.cookie(key, encodeURIComponent(value), {
            ...options,
            sameSite: "Lax",
            httpOnly: true,
          });
        },
        remove: (key: any, options: any) => {
          if (!context.response) return;
          context.response.cookie(key, "", { ...options, httpOnly: true });
        },
      },
    }
  );
}
