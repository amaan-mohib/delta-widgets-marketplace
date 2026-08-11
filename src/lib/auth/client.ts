"use client";

import { createAuthClient } from "@neondatabase/auth/next";

export const authClient = createAuthClient();

export const handleOAuthSignIn = async (provider: "google" | "github") => {
  try {
    await authClient.signIn.social({
      provider,
      callbackURL: window.location.origin,
      // callbackURL: "/dashboard",
      // newUserCallbackURL: "/welcome",
      // errorCallbackURL: "/error",
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};
