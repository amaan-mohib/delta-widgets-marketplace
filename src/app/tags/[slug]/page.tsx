import Hero from "@/components/hero";
import RootLayout from "@/components/root-layout";
import models from "@/lib/db/models";
import { Suspense } from "react";

const TagPage = async (props: PageProps<"/tags/[slug]">) => {
  const searchParams = await props.searchParams;
  const { slug } = await props.params;

  const page = Number(searchParams.page || 1);
  const limit = 30;
  const offset = (page - 1) * limit;

  // const [tags, totalRes] = await Promise.all([
  //   models
  //     .Categories()
  //     .where("count", ">", 0)
  //     .orderBy("count", "desc")
  //     .limit(limit)
  //     .offset(offset),
  //   models.Categories().where("count", ">", 0).count("id").first(),
  // ]);
  // const total = Number(totalRes?.count ?? 0);

  return <div>{slug}</div>;
};

export default async function TagSlug(props: PageProps<"/tags/[slug]">) {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero tab="tags" />
        <Suspense>
          <TagPage {...props} />
        </Suspense>
      </main>
    </RootLayout>
  );
}
