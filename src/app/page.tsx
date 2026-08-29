import Hero from "@/components/hero";
import { test } from "./actions";
import { Suspense } from "react";
import WidgetCard from "@/components/widget-card";
import { redirect } from "next/navigation";

const Widgets = async () => {
  const templates = await test();
  return templates.map((item) => <WidgetCard key={item.key} widget={item} />);
};

export default async function Home() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Hero tab="discover" />

      <div
        className="grid py-5 gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
        <Suspense fallback={"Loading..."}>
          <Widgets />
        </Suspense>
      </div>
    </main>
  );
}
