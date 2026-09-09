import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export const instant = false;

const Logout = async () => {
  await auth.signOut();
  redirect("/");
};

export default Logout;
