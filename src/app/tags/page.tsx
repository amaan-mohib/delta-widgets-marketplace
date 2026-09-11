import Hero from "@/components/hero";
import RootLayout from "@/components/root-layout";
import models from "@/lib/db/models";
import { Suspense } from "react";
import TagList from "./components/tag-list";

const TagListPage = async (props: PageProps<"/tags">) => {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page || 1);
  const limit = 30;
  const offset = (page - 1) * limit;

  const [tags, totalRes] = await Promise.all([
    models
      .Categories()
      .where("count", ">", 0)
      .orderBy("count", "desc")
      .limit(limit)
      .offset(offset),
    models.Categories().where("count", ">", 0).count("id").first(),
  ]);
  const total = Number(totalRes?.count ?? 0);

  return (
    <div>
      <TagList tags={tags} total={total} page={page} />
    </div>
  );
};

export default async function Tags(props: PageProps<"/tags">) {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero tab="tags" />
        <Suspense>
          <TagListPage {...props} />
        </Suspense>
      </main>
    </RootLayout>
  );
}
