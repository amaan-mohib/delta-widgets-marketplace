import { jwtVerify, createRemoteJWKSet } from "jose";
import { createNeonAuth } from "@neondatabase/auth/next/server";

const JWKS = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    // sessionDataTtl: 300, // optional session_data cache TTL in seconds (default: 300)
  },
  // logLevel: 'silent', // disable Managed Better Auth logging
  logLevel: process.env.NODE_ENV === "development" ? "debug" : "error", // verbose proxy/upstream logging
});

export async function validateNeonToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: new URL(process.env.NEON_AUTH_BASE_URL!).origin,
    });

    return payload;
  } catch (error) {
    console.error("Token validation failed:", error);
    return null;
  }
}
