import WaitlistPage from "@/components/waitlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waitlist",
};

const Waitlist = () => {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      <WaitlistPage />
    </main>
  );
};

export default Waitlist;
