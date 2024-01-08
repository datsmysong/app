export default function useApiBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return "https://api.datsmysong.app/";
  } else {
    return "http://localhost:3000";
  }
}
