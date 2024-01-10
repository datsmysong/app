import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import cors from "@fastify/cors";
import { Server } from "socket.io";
import HelloGet from "./route/HelloGET";
import RoomsGET from "./route/RoomGET";
import RoomPOST from "./route/RoomPOST";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "path";

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

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SERVICE_ROLE,
);

server.register(fastifyIO);

server.register(cors, {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "OPTIONS"],
});

server.get("/rooms", RoomsGET);

server.get("/hello", HelloGet);

const createRoomSchema = {
  body: {
    type: "object",
    required: ["name", "code", "service"],
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

server.post("/createRoom", { schema: createRoomSchema }, RoomPOST);

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
