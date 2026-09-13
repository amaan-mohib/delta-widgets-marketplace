import Hero from "@/components/hero";
import RootLayout from "@/components/root-layout";
import { Table } from "@/lib/db";
import models from "@/lib/db/models";
import { WidgetWithCreator } from "@/lib/types/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TagPage from "./tag-page";
import Loader from "@/components/loader";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: PageProps<"/tags/[slug]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;
  const parentMeta = await parent;

  const title = slug === "all" ? "All Widgets" : `#${slug}`;
  const description =
    slug === "all"
      ? "Check out all the widgets on Delta Widgets."
      : `Check out widgets tagged by #${slug} on Delta Widgets.`;

  return {
    title,
    description,
    openGraph: {
      ...parentMeta.openGraph,
      title,
      description,
    },
    twitter: {
      ...parentMeta.twitter,
      title,
      description,
    },
  };
}

const Tag = async (props: PageProps<"/tags/[slug]">) => {
  const searchParams = await props.searchParams;
  const { slug } = await props.params;

  const tag =
    slug !== "all"
      ? await models.Categories().select("id").where("slug", slug).first()
      : null;
  if (!tag && slug !== "all") {
    notFound();
  }

  const page = Number(searchParams.page || 1);
  const limit = 30;
  const offset = (page - 1) * limit;

  const [widgets, total] = await Promise.all([
    models
      .Widgets("w")
      .select(
        "w.id",
        "w.key",
        "w.download_count",
        "w.widget_type",
        "w.likes",
        "w.published_at",
        "wv.label",
        "wv.id as version_id",
        "wv.version",
        "wv.status",
        "p.username as creator",
        models
          .Assets("a")
          .join({ wva: Table.WidgetVersionAssets }, "a.id", "wva.asset_id")
          .whereRaw("wva.widget_version_id = wv.id")
          .where("a.asset_type", "SCREENSHOT")
          .orderBy("wva.sort_order")
          .limit(1)
          .select("a.src")
          .as("screenshot_src"),
      )
      .joinRaw(
        `JOIN (
            SELECT DISTINCT ON (widget_id) *
            FROM ${Table.WidgetVersions}
            WHERE status = 'PUBLISHED'
            ORDER BY widget_id, created_at DESC
          ) wv ON w.id = wv.widget_id`,
      )
      .join({ p: Table.UserProfiles }, "w.author_id", "p.user_id")
      .where((q) => {
        if (tag) {
          q.whereIn(
            "wv.id",
            models
              .WidgetVersionCategories()
              .select("widget_version_id")
              .where("category_id", tag.id),
          );
        }
      })
      .orderBy("w.created_at", "desc")
      .limit(limit)
      .offset(offset) as unknown as WidgetWithCreator[],
    models
      .WidgetVersions("wv")
      .count("id")
      .where((q) => {
        if (tag) {
          q.whereIn(
            "wv.id",
            models
              .WidgetVersionCategories()
              .select("widget_version_id")
              .where("category_id", tag.id),
          );
        }
      })
      .andWhere("wv.status", "PUBLISHED")
      .first(),
  ]);

  return (
    <div>
      <TagPage
        widgets={widgets}
        total={Number(total?.count ?? 0)}
        page={page}
        slug={slug}
      />
    </div>
  );
};

export default async function TagSlug(props: PageProps<"/tags/[slug]">) {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero tab="tags" />
        <Suspense fallback={<Loader />}>
          <Tag {...props} />
        </Suspense>
      </main>
    </RootLayout>
  );
}
