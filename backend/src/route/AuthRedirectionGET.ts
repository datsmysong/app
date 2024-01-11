import { FastifyRequest, FastifyReply } from "fastify";

export default function AuthRedirectionGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  reply.header("Content-Type", "text/html");
  reply.code(200).send(ReponseHTML);
}

const ReponseHTML = `
<html>
  <script>
    const url = window.location.href;
    const code_verifier = url.split("#")[1].split("=")[1];
    const redirect_url = url.split("redirect_url=")[1].split("#")[0];

    console.log("url", url);
    console.log("code_verifier", code_verifier);
    console.log("redirect url", redirect_url);
    document.cookie = "sb-ckalsdcwrofxvgxslwiv-auth-token-code-verifier=" + code_verifier + "; path=/";

    // redirect to the redirect url
    window.location.href = redirect_url;
  </script>
</html>`;
