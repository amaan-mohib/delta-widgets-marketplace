"use client";

import { authClient } from "@/lib/auth/client";
import { useAuth } from "@/store/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserProfile } from "../actions";
import { Header } from "@/components/header";
import { Spinner } from "@fluentui/react-components";

const DashboardLayout = ({ children }: LayoutProps<"/dashboard">) => {
  const { loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getUser = async () => {
    try {
      useAuth.setState({ loading: true });
      const { data } = await authClient.getSession();
      const user = data?.user;
      if (!user) {
        router.replace("/login?redirect=" + pathname);
        return;
      }

      const profile = await getUserProfile(user.id);
      useAuth.setState({
        user,
        loading: false,
        profile: profile || null,
      });

      if (!profile) {
        router.replace("/dashboard/welcome?redirect=" + pathname);
      }
    } catch (error) {
      console.error(error);
      useAuth.setState({ loading: false, user: null, profile: null });
      router.replace("/login?redirect=" + pathname);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <>
        <Header isDashboard />
        <main className="flex items-center justify-center">
          <Spinner />
        </main>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return children;
};

export default DashboardLayout;
