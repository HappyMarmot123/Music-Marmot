import axios from "axios";

const isServer = typeof window === "undefined";

const baseURL = isServer
  ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}`
  : "";

export const axiosInstance = axios.create({
  baseURL,
  // We will try to use abortController or lodash.debounce on Request
  headers: {
    "Content-Type": "application/json",
  },
});
