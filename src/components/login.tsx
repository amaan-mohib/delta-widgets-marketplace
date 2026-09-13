"use client";

import { handleOAuthSignIn } from "@/lib/auth/client";
import { Button, Title1 } from "@fluentui/react-components";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";

interface LoginProps {}

const LoginPage: React.FC<LoginProps> = () => {
  const searchParams = useSearchParams();
  const callback = searchParams.get("redirect");

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-5 pt-10">
        <Title1>Login</Title1>
        <div className="flex flex-col items-center justify-center gap-3 pt-10">
          <Button
            size="large"
            onClick={() => handleOAuthSignIn("google", callback)}
            icon={<IconBrandGoogleFilled />}>
            Sign in with Google
          </Button>
          <Button
            size="large"
            onClick={() => handleOAuthSignIn("github", callback)}
            icon={<IconBrandGithub />}>
            Sign in with GitHub
          </Button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
