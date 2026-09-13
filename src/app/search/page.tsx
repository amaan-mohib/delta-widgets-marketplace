import Hero from "@/components/hero";
import RootLayout from "@/components/root-layout";
import { Suspense } from "react";
import SearchPage from "./components/search-page";

export default async function Search() {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero tab="search" />
        <Suspense>
          <SearchPage />
        </Suspense>
      </main>
    </RootLayout>
  );
}
