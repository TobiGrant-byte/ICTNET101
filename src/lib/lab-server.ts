export const LAB_SERVER_URL =
  process.env.NEXT_PUBLIC_LAB_SERVER_URL?.replace(
    /\/$/,
    ""
  ) || "";

export function getLabServerUrl() {
  if (!LAB_SERVER_URL) {
    throw new Error(
      "NEXT_PUBLIC_LAB_SERVER_URL is not configured."
    );
  }

  return LAB_SERVER_URL;
}

export function getLabWebSocketUrl() {
  const url = getLabServerUrl();

  return url
    .replace(/^https:\/\//, "wss://")
    .replace(/^http:\/\//, "ws://");
}