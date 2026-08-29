"use client";

import { handleOAuthSignIn } from "@/lib/auth/client";
import { Button } from "@fluentui/react-components";
import { useSearchParams } from "next/navigation";

interface LoginProps {}

const LoginPage: React.FC<LoginProps> = () => {
  const searchParams = useSearchParams();
  const callback = searchParams.get("redirect");

  return (
    <div>
      <Button onClick={() => handleOAuthSignIn("google", callback)}>
        Sign in with Google
      </Button>
      <Button onClick={() => handleOAuthSignIn("github", callback)}>
        Sign in with GitHub
      </Button>
    </div>
  );
};

export default LoginPage;
