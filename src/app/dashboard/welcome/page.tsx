import { Header } from "@/components/header";
import WelcomePage from "@/components/welcome";
import { Metadata } from "next";

export const instant = false;

export const metadata: Metadata = {
  title: "Welcome",
};

const Welcome = () => {
  return (
    <>
      <Header isDashboard />
      <WelcomePage />
    </>
  );
};

export default Welcome;
