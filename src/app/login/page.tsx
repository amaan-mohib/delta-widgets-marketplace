import LoginPage from "@/components/login";
import RootLayout from "@/components/root-layout";
import { Suspense } from "react";

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
