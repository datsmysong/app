import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";
import { createAccount } from "./AuthCallbackGET";

interface BodyParams {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export default async function AuthRegister(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const body: BodyParams = req.body as BodyParams;
  const { username, email, password } = body;
  const displayName = body.displayName ? body.displayName : username;

  const { message, valid } = await verifyInformations({
    username: username,
    email: email,
    password: password,
    displayName: displayName,
  });

  if (!valid) {
    return reply.status(400).send({ error: message });
  }

  const urlFront = process.env.FRONTEND_URL;

  const {
    data: { user },
    error: signUpError,
  } = await adminSupabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: urlFront,
    },
  });

  if (signUpError || user === null) {
    return reply.status(400).send({ error: "Registration failed!" });
  }

  const usernameTaken = await isUsernameTaken(body.username);
  if (usernameTaken) {
    return reply.code(409).send({ error: "This username is taken" });
  }

  const { userProfileId, error } = await createAccount({
    displayName: displayName,
    accountId: user.id,
    username: username,
  });

  if (error || !userProfileId) {
    req.log.error(
      "Impossible to create account: " + error?.code + " " + error?.message
    );
    return reply.status(500).send({ error: "Impossible to create account" });
  }

  return reply.status(200).send({ message: "Account created" });
}

const verifyInformations = async (body: BodyParams) => {
  if (body.username.length < 3 || body.username.length > 20) {
    return {
      message: "Username must be between 3 and 20 characters",
      valid: false,
    };
  }
  if (body.displayName.length < 3 || body.displayName.length > 20) {
    return {
      message: "Display name must be between 3 and 20 characters",
      valid: false,
    };
  }
  if (body.password.length < 8) {
    return {
      message: "Password must be at least 8 characters",
      valid: false,
    };
  }
  return { valid: true };
};

const isUsernameTaken = async (username: string) => {
  const { data, error } = await adminSupabase
    .from("user_profile")
    .select("username")
    .eq("username", username);

  return error || data.length > 0;
};
