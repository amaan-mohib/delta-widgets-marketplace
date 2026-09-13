import LoginPage from "@/components/login";
import RootLayout from "@/components/root-layout";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
};

const Login = async () => {
  return (
    <RootLayout>
      <Suspense>
        <LoginPage />
      </Suspense>
    </RootLayout>
  );
};

export default Login;
