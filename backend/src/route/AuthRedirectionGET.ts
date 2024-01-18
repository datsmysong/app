import { FastifyRequest, FastifyReply } from "fastify";

export default function AuthRedirectionGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  reply.header("Content-Type", "text/html");
  reply.code(200).send(getReponseHTML());
}

// return static html page with loader
const getReponseHTML = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Missing SUPABASE_URL");
  const supabaseId = supabaseUrl.split(".")[0].split("//")[1];
  return `
  <html>

    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500&display=swap" rel="stylesheet">
    </head>

    <body>
        <div class="main">
            <div class="central">
                <span>Redirection en cours...</span>
                <div class="loader"></div>
            </div>
        </div>
    </body>
    <style>
        body {
          margin: 0;
          padding: 0;
        }
        .central span {
            font-size: 24px;
            font-family: 'Unbounded', sans-serif;
            width: 220px;
        }
      
        .main {
            height: 100dvh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0px 51px;
        }
      
        .central {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
      
        .loader {
            border: 4px solid #f3f3f3;
            /* Light grey */
            border-top: 4px solid #1a1a1a;
            /* Blue */
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
        }
      
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
          
            100% {
                transform: rotate(360deg);
            }
        }
    </style>
      
    <script>
      const url = window.location.href;
      const code_verifier = url.split("#")[1].split("=")[1];
      const redirect_url = url.split("redirect_url=")[1].split("#")[0];
      document.cookie = "sb-${supabaseId}-auth-token-code-verifier=" + code_verifier + "; path=/";
      // redirect to the redirect url
      window.location.href = redirect_url;
    </script>
  </html>`;
};
