import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { Server } from "socket.io";
import HelloGet from "./route/HelloGET";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

server.register(fastifyIO);

server.get("/", (req, reply) => {
  reply.send({ hello: "world" });
});

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
