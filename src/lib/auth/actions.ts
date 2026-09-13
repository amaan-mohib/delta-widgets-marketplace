"use server";

import { redirect } from "next/navigation";
import { auth } from "./server";

export const logout = async () => {
  await auth.signOut();
  redirect("/");
};
