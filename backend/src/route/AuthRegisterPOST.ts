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
  const { username, email, password, displayName } = body;
  const verification = verifyInformations(body);

  if (verification !== true) {
    return reply.status(400).send({ error: verification });
  }

  const {
    data: { user },
    error: signUpError,
  } = await adminSupabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: "http://localhost:8081",
    },
  });

  if (signUpError || user === null) {
    return reply
      .status(400)
      .send({ error: "Impossible to register this user !" });
  }
  const { userProfileId, error } = await createAccount({
    displayName: displayName,
    account_id: user.id,
    username: username,
  });

  if (error || !userProfileId) {
    req.log.error(
      "Impossible to create account: " + error?.code + " " + error?.message
    );
    return reply.status(400).send({ error: "Impossible to create account" });
  }

  return reply.status(200).send({ message: "Account created" });
}

const verifyInformations = (body: BodyParams) => {
  if (body.username.length < 3 || body.username.length > 20) {
    return "Username must be between 3 and 20 characters";
  }

  if (body.displayName.length < 3 || body.displayName.length > 20) {
    return "Display name must be between 3 and 20 characters";
  }

  if (body.password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return true;
};
