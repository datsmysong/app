export const getApiUrl = (url: string) => {
  return url.includes("exp://")
    ? "http://" + url.split(":8081")[0].split("//")[1]
    : "http://" + url.split(":8081")[0];
};
