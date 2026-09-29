import Hero from "@/components/hero";
import { getWidgets } from "./actions";
import RootLayout from "@/components/root-layout";
import { cacheLife, cacheTag } from "next/cache";
import Homepage from "./homepage";

const Widgets = async () => {
  const [trending, newWidgets, popular] = await Promise.all([
    getWidgets("likes"),
    getWidgets("published_at"),
    getWidgets("download_count"),
  ]);

  const filteredTrending = newWidgets.filter(
    (w) => !newWidgets.map((t) => t.key).includes(w.key),
  );
  const filteredPopular = popular.filter(
    (w) => ![...trending, ...newWidgets].map((t) => t.key).includes(w.key),
  );

  return (
    <Homepage
      newWidgets={newWidgets}
      trending={filteredTrending}
      popular={filteredPopular}
    />
  );
};

export default async function Home() {
  "use cache";
  cacheLife("hours");
  cacheTag("widgets");

  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero tab="discover" />
        <Widgets />
      </main>
    </RootLayout>
  );
}
