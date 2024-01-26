import fastifyCors from "@fastify/cors";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { Server } from "socket.io";
import authRoutes from "./authRoutes";
import RoomIdGET from "./route/RoomIdGET";
import StreamingServicesGET from "./route/StreamingServicesGET";
import { FastifyCookieOptions } from "@fastify/cookie";
import { Database } from "commons/database-types";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import RoomIO from "./socketio/RoomIO";
import RoomGET from "./route/RoomGET";
import RoomPOST from "./route/RoomPOST";

config({ path: ".env.local" });

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

if (!process.env.FRONTEND_URL) {
  throw new Error(
    "Missing FRONTEND_URL environment variable, check .env.local.example file"
  );
}
export const adminSupabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SERVICE_ROLE
);

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error("Missing Spotify credentials");
}

export const spotify = SpotifyApi.withClientCredentials(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET
);
server.register(fastifyIO, {
  cors: {
    origin: "*",
  },
});
server.register(require("@fastify/cookie"), {
  secret: process.env.FASTIFY_COOKIE_SECRET ?? "", // for cookies signature
  hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {}, // options for parsing cookies
} as FastifyCookieOptions);

server.register(fastifyCors, {
  origin: [true], // or true to allow all origins
  methods: ["*"], // or just ['*'] for all methods
  credentials: true, // or true to reflect origin
});

// timeWindow : It can be expressed in milliseconds or as a string (in the ms format)
// https://github.com/vercel/ms
server.register(import("@fastify/rate-limit"), {
  max: 50,
  timeWindow: "1 minute",
});

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
      "maxMusicDuration",
    ],
    properties: {
      name: { type: "string" },
      code: { type: "string" },
      service: { type: "string" },
      voteSkipping: { type: "boolean" },
      voteSkippingNeeded: { type: "number" },
      maxMusicPerUser: { type: "number" },
      maxMusicDuration: { type: "number" },
    },
  },
};

server.post("/rooms/create", { schema: createRoomSchema }, RoomPOST);

// Auth
server.register(authRoutes, { prefix: "/auth" });

server.get("/streaming-services", StreamingServicesGET);

server.get("/room/:id", RoomIdGET);

server.get("/rooms", RoomGET);

// server.get("/track/spotify/:id", SpotifyGET);

server.ready().then(() => {
  server.io.of(/^\/room\/.*$/i).on("connection", RoomIO);
});

server.listen({ port: 3000, host: "0.0.0.0" });

declare module "fastify" {
  interface FastifyInstance {
    io: Server<{
      hello: (a: string) => void;
    }>;
  }
}
