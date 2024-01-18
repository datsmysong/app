import type { FastifyCookieOptions } from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { createClient } from "@supabase/supabase-js";
import { Database } from "commons/database-types";
import { config } from "dotenv";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import path from "path";
import { Server } from "socket.io";
import AuthCallbackGET from "./route/AuthCallbackGET";
import AuthRedirectionGET from "./route/AuthRedirectionGET";
import RoomGET from "./route/RoomGET";
import RoomPOST from "./route/RoomPOST";
import StreamingServicesGET from "./route/StreamingServicesGET";

config({ path: path.resolve(__dirname, "../.env.local") });

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

if (!process.env.SUPABASE_URL || !process.env.SERVICE_ROLE) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE environment variable"
  );
}
export const adminSupabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SERVICE_ROLE
);

server.register(fastifyIO);
server.register(require("@fastify/cookie"), {
  secret: process.env.FASTIFY_COOKIE_SECRET ?? "", // for cookies signature
  hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {}, // options for parsing cookies
} as FastifyCookieOptions);

server.get("/rooms", RoomGET);
server.register(fastifyCors, {
  origin: [true], // or true to allow all origins
  methods: ["*"], // or just ['*'] for all methods
});

// Auth
server.get("/auth/callback", AuthCallbackGET);
server.get("/auth/redirection", AuthRedirectionGET);

server.get("/streaming-services", StreamingServicesGET);

const createRoomSchema = {
  body: {
    type: "object",
    required: [
      "name",
      "code",
      "service",
      "voteSkipping",
      "voteSkippingNeeded",
      "maxMusicPerUser",
      "maxMusicPerUserDuration",
    ],
    properties: {
      name: { type: "string" },
      code: { type: "string" },
      service: { type: "string" },
      voteSkipping: { type: "boolean" },
      voteSkippingNeeded: { type: "number" },
      maxMusicPerUser: { type: "number" },
      maxMusicPerUserDuration: { type: "number" },
    },
  },
};

server.post("/rooms/create", { schema: createRoomSchema }, RoomPOST);

server.ready().then(() => {
  // we need to wait for the server to be ready, else `server.io` is undefined
  server.io.on("connection", (socket: any) => {
    console.info("Socket connected!", socket.id);
    socket.emit("hello", "world");
  });
});

server.listen({ port: 3000, host: "0.0.0.0" });

declare module "fastify" {
  interface FastifyInstance {
    io: Server<{
      hello: (a: string) => void;
    }>;
  }
}
