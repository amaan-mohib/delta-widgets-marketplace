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
      callbackURL: callbackURL || "/dashboard",
      newUserCallbackURL: "/dashboard/welcome",
      errorCallbackURL: "/error",
    });
  } catch (error) {
    console.error("OAuth sign-in error:", error);
  }
};
