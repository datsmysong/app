import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { createClient } from "@supabase/supabase-js";
import { Database } from "commons/database-types";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { config } from "dotenv";
import fastifySocketIO from "fastify-socket.io";
import { Server } from "socket.io";
import authRoutes from "./authRoutes";
import AuthCallbackBindSpotifyGET from "./route/AuthCallbackBindSpotifyGET";
import AuthCallbackSoundcloudGET from "./route/AuthCallbackSoundcloudGET";
import BoundServicesGET from "./route/BoundServicesGET";
import RoomConfigurationUpdatePOST from "./route/RoomConfigurationUpdatePOST";
import RoomEndGET from "./route/RoomEndGET";
import RoomGET from "./route/RoomGET";
import RoomIdGET from "./route/RoomIdGET";
import RoomLeaveGET from "./route/RoomLeaveGET";
import RoomPOST from "./route/RoomPOST";
import StreamingServicesGET from "./route/StreamingServicesGET";
import UnbindServicePOST from "./route/UnbindServicePOST";
import RecentMusicsGET from "./route/RecentMusicsGET";
import onRoomWSConnection from "./socketio/RoomIO";
import * as Sentry from "@sentry/node";

config({ path: ".env.local" });

/**
 * If we set the CORS origin to ["*"], it tells the client that all origins are accepted
 * This won't work if the client fetches our backend with credentials, because it's simply unauthorized by the CORS spec
 * To fix this, we return [true], which sets the CORS origin header to the request origin, which means it will trick the client to believe only its origin is allowed to fetch the URL

 * Returns an array of allowed CORS origins based on the current environment.
 * @param devValue - The value to use when inside a development environment.
 * @returns An array of allowed CORS origins.
 */
const corsOrigin: (devValue?: string | boolean) => (string | boolean)[] = (
  devValue = true
) => {
  if (process.env.NODE_ENV === "development") return [devValue];
  return ["https://datsmysong.app", "https://api.datsmysong.app/"];
};

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: "https://349dd8dd31222fcee73479d237a589dd@o4507124937064448.ingest.de.sentry.io/4507226372636752",

  // Add Performance Monitoring by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === "development",
});

// (!) This import should be done after the Sentry.init call
import fastify from "fastify";

export const server = fastify({
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

Sentry.setupFastifyErrorHandler(server);

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

if (
  !process.env.SOUNDCLOUD_CLIENT_ID ||
  !process.env.SOUNDCLOUD_CLIENT_SECRET
) {
  throw new Error(
    "Missing SOUNDCLOUD_CLIENT_ID or SOUNDCLOUD_CLIENT_SECRET environment variable"
  );
}

if (!process.env.SPOTIFY_CLIENT_ID) {
  throw new Error(
    "Missing SPOTIFY_CLIENT_ID environment variable, check .env.local.example file"
  );
}

if (!process.env.BACKEND_URL && process.env.NODE_ENV === "production") {
  throw new Error(
    "Missing BACKEND_URL environment variable, check .env.local.example file"
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
server.register(fastifySocketIO, {
  cors: {
    origin: corsOrigin(),
    methods: ["GET", "POST"],
    credentials: true,
  },
});
server.register(fastifyCookie, {
  secret: process.env.FASTIFY_COOKIE_SECRET ?? "",
  hook: "onRequest",
  parseOptions: {},
} as FastifyCookieOptions);

server.register(fastifyCors, {
  origin: corsOrigin(),
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  credentials: true,
});

// timeWindow : It can be expressed in milliseconds or as a string (in the ms format)
// https://github.com/vercel/ms
server.register(import("@fastify/rate-limit"), {
  max: 50,
  timeWindow: "1 minute",
});

server.get("/health", (req, res) => {
  res.code(200).send({ status: "ok" });
});

// Auth

// This route that handles SoundCloud auth is on the root route because we are awaiting SoundCloud to change the redirection URL
server.get("/", AuthCallbackSoundcloudGET);
server.get("/user/bound", BoundServicesGET);
server.register(authRoutes, { prefix: "/auth" });
server.get("/auth/callback/bind/spotify", AuthCallbackBindSpotifyGET);

server.get("/streaming-services", StreamingServicesGET);
server.delete("/streaming-service/:uuid", UnbindServicePOST);

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

server.post<{
  Reply: {
    message: string;
    room: { uuid: string } | null;
    error: object | null;
  };
}>("/rooms/create", { schema: createRoomSchema }, RoomPOST);

server.get("/roomStorage/:id", RoomIdGET);

server.get("/room/:id/leave", RoomLeaveGET);

server.get("/room/:id/end", RoomEndGET);

server.get("/rooms", RoomGET);

server.post("/room/configuration/:id", RoomConfigurationUpdatePOST);

// server.get("/track/spotify/:id", SpotifyGET);
const getRoomSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
};

server.get("/room/:id", { schema: getRoomSchema }, RoomGET);

server.get("/recent-musics", RecentMusicsGET);

server.ready().then(() => {
  server.io.of(/^\/room\/.*$/i).on("connection", onRoomWSConnection);
});

server.listen({ port: 3000, host: "0.0.0.0" });

declare module "fastify" {
  interface FastifyInstance {
    io: Server<ClientToServerEvents, ServerToClientEvents>;
  }
}
