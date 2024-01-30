import fastifyCors from "@fastify/cors";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import { Server } from "socket.io";
import authRoutes from "./authRoutes";
import AuthCallbackBindSpotifyGET from "./route/AuthCallbackBindSpotifyGET";
import AuthCallbackSoundcloudGET from "./route/AuthCallbackSoundcloudGET";
import BoundServicesGET from "./route/BoundServicesGET";
import RoomIdGET from "./route/RoomIdGET";
import StreamingServicesGET from "./route/StreamingServicesGET";
import UnbindServicePOST from "./route/UnbindServicePOST";
import { Database } from "commons/database-types";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import RoomIO from "./socketio/RoomIO";
import RoomGET from "./route/RoomGET";
import RoomPOST from "./route/RoomPOST";
import RoomEndGET from "./route/RoomEndGET";
import { RoomJSON } from "commons/backend-types";

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
server.register(fastifyIO, {
  cors: {
    origin: "*",
  },
});
server.register(fastifyCookie, {
  secret: process.env.FASTIFY_COOKIE_SECRET ?? "", // for cookies signature
  hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {}, // options for parsing cookies
} as FastifyCookieOptions);

/**
If we set the CORS origin to ["*"], it tells the client that all origins are accepted
This won't work if the client fetches our backend with credentials, because it's simply unauthorized by the CORS spec
To fix this, we return [true], which sets the CORS origin header to the request origin, which means it will trick the client to believe only its origin is allowed to fetch the URL
*/
const corsOrigin: () => string[] | boolean[] = () => {
  if (process.env.NODE_ENV === "development") return [true];
  return ["https://datsmysong.app", "https://api.datsmysong.app/"];
};

server.register(fastifyCors, {
  origin: corsOrigin(), // or true to allow all origins
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"], // or just ['*'] for all methods
  credentials: true, // or true to reflect origin
});

// timeWindow : It can be expressed in milliseconds or as a string (in the ms format)
// https://github.com/vercel/ms
server.register(import("@fastify/rate-limit"), {
  max: 50,
  timeWindow: "1 minute",
});

// Auth
server.get("/", AuthCallbackSoundcloudGET); // / route is used until soundcloud change the redirection url
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

server.get("/room/:id", RoomIdGET);

server.get("/room/:id/end", RoomEndGET);

server.get("/rooms", RoomGET);

// server.get("/track/spotify/:id", SpotifyGET);

server.ready().then(() => {
  server.io.of(/^\/room\/.*$/i).on("connection", RoomIO);
});

server.listen({ port: 3000, host: "0.0.0.0" });

declare module "fastify" {
  interface FastifyInstance {
    io: Server<{
      "queue:update": (room: RoomJSON) => void;
      "queue:deleted": () => void;
    }>;
  }
}
