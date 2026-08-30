"use client";

import { authClient } from "@/lib/auth/client";
import { useAuth } from "@/store/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserProfile } from "../actions";
import { Header } from "@/components/header";

const DashboardLayout = ({ children }: LayoutProps<"/dashboard">) => {
  const { loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    authClient.getSession().then(async ({ data }) => {
      const user = data?.user;
      if (!user) {
        router.replace("/login?redirect=" + pathname);
        return;
      }

      const profile = await getUserProfile(user.id);
      useAuth.setState({
        user,
        loading: false,
        profile,
      });

      if (!profile) {
        router.replace("/dashboard/welcome?redirect=" + pathname);
      }
    });
  }, []);

  if (loading) {
    return (
      <>
        <Header isDashboard /> <main>Loading</main>
      </>
    );
  }

  return children;
};

export default DashboardLayout;
