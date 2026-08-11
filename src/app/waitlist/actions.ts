"use server";

import models from "@/lib/db/models";
import z from "zod";

export const submitWaitlist = async (
  email: string,
): Promise<{
  message: string;
  state?: "error" | "warning" | "success" | "none";
}> => {
  const validation = z.email().safeParse(email);
  if (!validation.success) {
    return {
      message: "Please enter a valid email",
      state: "error",
    };
  }
  const existing = await models.Waitlists().where("email", email).first();
  if (existing) {
    return {
      message: "You have already registered!",
      state: "warning",
    };
  }
  await models.Waitlists().insert({ email });
  return {
    message: "You have been registered for the waitlist!",
    state: "success",
  };
};
