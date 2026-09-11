import Hero from "@/components/hero";
import RootLayout from "@/components/root-layout";

export default async function Categories() {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero tab="categories" />
      </main>
    </RootLayout>
  );
}
