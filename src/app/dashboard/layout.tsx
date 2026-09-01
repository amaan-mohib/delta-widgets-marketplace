"use client";

import { useAuth } from "@/store/useAuth";
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

    if (!user) {
      router.replace("/login?redirect=" + pathname);
      return;
    }
    if (!profile) {
      router.replace("/dashboard/welcome?redirect=" + pathname);
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
