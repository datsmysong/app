import { FastifyInstance } from "fastify";
import AuthCallbackGET from "./route/AuthCallbackGET";
import AuthRedirectionGET from "./route/AuthRedirectionGET";
import AuthRegister from "./route/AuthRegisterPOST";

// All routes prefixed with /auth
export default function authRoutes(
  server: FastifyInstance,
  opts: unknown,
  done: () => void
) {
  server.rateLimit({
    max: 100,
    timeWindow: "1 minute",
  });

  server.get("/callback", AuthCallbackGET);
  server.get("/redirection", AuthRedirectionGET);
  server.post(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
            username: { type: "string" },
            displayName: { type: "string" },
          },
        },
      },
    },
    AuthRegister
  );

  done();
}
