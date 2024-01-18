import { makeRedirectUri } from "expo-auth-session";

const directUri = makeRedirectUri();

export const getApiUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.EXPO_PUBLIC_BACKEND_API;
  }
  return (
    (directUri.includes("exp://")
      ? "http://" + directUri.split(":8081")[0].split("//")[1]
      : directUri.split(":8081")[0]) + ":3000"
  );
};
