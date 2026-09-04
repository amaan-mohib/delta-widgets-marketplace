"use client";

import { handleOAuthSignIn } from "@/lib/auth/client";
import { Button, Title1 } from "@fluentui/react-components";
import { useSearchParams } from "next/navigation";

interface LoginProps {}

const LoginPage: React.FC<LoginProps> = () => {
  const searchParams = useSearchParams();
  const callback = searchParams.get("redirect");

  return (
    <main>
      <Title1>Login</Title1>
      <div>
        <Button onClick={() => handleOAuthSignIn("google", callback)}>
          Sign in with Google
        </Button>
        <Button onClick={() => handleOAuthSignIn("github", callback)}>
          Sign in with GitHub
        </Button>
      </div>
    </main>
  );
};

export default LoginPage;
