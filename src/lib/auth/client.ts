"use client";

import { createAuthClient } from "@neondatabase/auth/next";

export const authClient = createAuthClient();

export const handleOAuthSignIn = async (
  provider: "google" | "github",
  callbackURL?: string | null,
) => {
  try {
    await authClient.signIn.social({
      provider,
      callbackURL: `/login?redirect=${encodeURIComponent(callbackURL || "/dashboard")}`,
      errorCallbackURL: "/error",
      additionalData: { prompt: "select_account" }, // doesn't work
    });
  } catch (error) {
    console.error("OAuth sign-in error:", error);
  }
};
