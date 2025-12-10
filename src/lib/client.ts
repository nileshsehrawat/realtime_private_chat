import { treaty } from "@elysiajs/eden";
import type { App } from "../app/api/[[...slugs]]/route";

const getApiUrl = () => {
  // On client side, use current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // On server side, use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};

export const client = treaty<App>(getApiUrl()).api;
