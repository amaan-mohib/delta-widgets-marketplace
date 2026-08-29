import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

const Logout = async () => {
  await auth.signOut();
  redirect("/");
};

export default Logout;
