import LoginPage from "@/components/login";
import RootLayout from "@/components/root-layout";

export const instant = false;

const Login = () => {
  return (
    <RootLayout>
      <LoginPage />
    </RootLayout>
  );
};

export default Login;
