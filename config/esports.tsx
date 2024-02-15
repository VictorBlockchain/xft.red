import axios from "axios";

let isLocalhost = false;
if (typeof window !== 'undefined') {
  isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      window.location.hostname === "[::1]" ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );
}

const SERVER_URL = isLocalhost
  ? "http://localhost:3000"
  : "https://nftea.app";

export const Axios = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: true,
});

export const STREAM_URL:any = typeof window !== 'undefined' ? `${SERVER_URL}/api/esports/sse` : null;

export const esports_sse:any = typeof window !== 'undefined' ? new EventSource(STREAM_URL, { withCredentials: false }) : null;
