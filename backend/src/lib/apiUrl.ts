export const getApiUrl = (url: string): string => {
  if (process.env.NODE_ENV === "development") {
    if (!process.env.BACKEND_URL) throw new Error("Missing BACKEND_URL");
    return process.env.BACKEND_URL;
  }
  return url.includes("exp://")
    ? "http://" + url.split(":8081")[0].split("//")[1]
    : "http://" + url.split(":8081")[0];
};
