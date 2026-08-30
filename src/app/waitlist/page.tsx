"use cache";

import RootLayout from "@/components/root-layout";
import WaitlistPage from "@/components/waitlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waitlist",
};

const Waitlist = async () => {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <WaitlistPage />
      </main>
    </RootLayout>
  );
};

export default Waitlist;
