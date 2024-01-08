import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { Server } from "socket.io";
import HelloGet from "./route/HelloGET";
import RoomsGET from "./route/RoomGET";
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
  process.env.SERVICE_ROLE
);

server.register(fastifyIO);

server.get("/rooms", RoomsGET);

server.get("/hello", HelloGet);

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
