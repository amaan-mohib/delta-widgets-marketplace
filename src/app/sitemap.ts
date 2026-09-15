import { WEBSITE_URL } from "@/lib/constants";
import { Table } from "@/lib/db";
import models from "@/lib/db/models";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tags, widgets, creators] = await Promise.all([
    models
      .Categories()
      .select("slug", "updated_at")
      .where("count", ">", 0)
      .orderBy("count", "desc"),
    models
      .Widgets("w")
      .select("w.id", "w.key", "w.published_at")
      .join({ wv: Table.WidgetVersions }, "wv.id", "w.latest_version_id")
      .where("wv.status", "PUBLISHED")
      .orderBy("w.created_at", "desc"),
    models
      .UserProfiles("p")
      .select("p.username")
      .max("w.updated_at as updated_at")
      .join({ w: Table.Widgets }, "w.author_id", "p.user_id")
      .whereNotNull("w.latest_version_id")
      .groupBy("p.username") as unknown as any[],
  ]);

  return [
    {
      url: WEBSITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: WEBSITE_URL + "/categories",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: WEBSITE_URL + "/tags/all",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...(tags.map((t) => ({
      url: WEBSITE_URL + "/tags/" + t.slug,
      lastModified: new Date(t.updated_at),
      changeFrequency: "daily",
      priority: 1,
    })) as MetadataRoute.Sitemap),
    ...(widgets.map((w) => ({
      url: WEBSITE_URL + "/widget/" + w.key,
      lastModified: new Date(w.published_at),
      changeFrequency: "monthly",
      priority: 1,
    })) as MetadataRoute.Sitemap),
    ...(creators.map((c) => ({
      url: WEBSITE_URL + "/creator/" + c.username,
      lastModified: new Date(c.updated_at),
      changeFrequency: "monthly",
      priority: 1,
    })) as MetadataRoute.Sitemap),
  ];
}
