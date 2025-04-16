import { makeRedirectUri } from "expo-auth-session";

export const getApiUrl = () => {
  const currentUrl = makeRedirectUri();

  if (!process.env.EXPO_PUBLIC_BACKEND_API) {
    console.warn(
      "EXPO_PUBLIC_BACKEND_API is not defined, defaulting to development URL"
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.EXPO_PUBLIC_BACKEND_API
  ) {
    return process.env.EXPO_PUBLIC_BACKEND_API;
  }

  if (!currentUrl) return "http://localhost:3000";

  /*
   directUri is something like:
   exp://127.0.0.1:19000/--/some/path
   http://127.0.0.1:8081/some/path
   */
  const sliced = currentUrl.split("/").slice(2, 3).join("").split(":")[0];
  return "http://" + sliced + ":3000";
};
