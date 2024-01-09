import { config } from "dotenv";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import path from "path";
import { Server } from "socket.io";
import AuthCallbackGET from "./route/AuthCallbackGET";
import type { FastifyCookieOptions } from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { createClient } from "@supabase/supabase-js";

config({ path: path.resolve(__dirname, "../.env.local") });

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

if (!process.env.SUPABASE_URL || !process.env.SERVICE_ROLE) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY environment variable");
}
export const adminSupabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SERVICE_ROLE
);

server.register(fastifyIO);
server.register(require("@fastify/cookie"), {
  secret: "my-secret", // for cookies signature
  hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {}, // options for parsing cookies
} as FastifyCookieOptions);

server.register(fastifyCors, {
  origin: ["http://localhost:8081"], // or true to allow all origins
  methods: ["*"], // or just ['*'] for all methods
});

server.get("/auth/callback", AuthCallbackGET);

server.ready().then(() => {
  // we need to wait for the server to be ready, else `server.io` is undefined
  server.io.on("connection", (socket: any) => {
    console.info("Socket connected!", socket.id);
    socket.emit("hello", "world");
  });
});

server.listen({ port: 3000 });

declare module "fastify" {
  interface FastifyInstance {
    io: Server<{
      hello: (a: string) => void;
    }>;
  }
}
