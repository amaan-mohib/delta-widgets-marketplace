"use client";

import { useAuth } from "@/store/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { Spinner } from "@fluentui/react-components";

const DashboardLayout = ({ children }: LayoutProps<"/dashboard">) => {
  const { loading, user, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const searchParams = new URLSearchParams(window.location.search);
    const searchStr = searchParams.toString();
    const redirectTo = encodeURIComponent(
      pathname + (searchStr ? `?${searchStr}` : ""),
    );

    if (!user) {
      router.replace("/login?redirect=" + redirectTo);
      return;
    }
    if (!profile) {
      router.replace("/dashboard/welcome?redirect=" + redirectTo);
    }
  }, [user, profile, loading]);

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
