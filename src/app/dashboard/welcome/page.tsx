import { getAuthUser } from "@/app/actions";
import { Header } from "@/components/header";
import WelcomePage from "@/components/welcome";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const instant = false;

export const metadata: Metadata = {
  title: "Welcome",
};

const Welcome = async (props: PageProps<"/dashboard/welcome">) => {
  const searchParams = await props.searchParams;
  const user = await getAuthUser();

  if (user?.profile?.username) {
    const redirectTo = searchParams?.redirect as string;
    redirect(redirectTo || "/dashboard");
  }

  return (
    <>
      <Header isDashboard />
      <WelcomePage />
    </>
  );
};

export default Welcome;
