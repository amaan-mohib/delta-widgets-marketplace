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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense>
          <LoginPage />
        </Suspense>
      </main>
    </RootLayout>
  );
};

export default Login;
