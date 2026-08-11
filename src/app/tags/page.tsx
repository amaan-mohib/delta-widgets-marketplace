import Hero from "@/components/hero";
import { redirect } from "next/navigation";

export default async function Tags() {
  redirect("/waitlist");

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Hero tab="tags" />
    </main>
  );
}
