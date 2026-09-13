import { WEBSITE_URL } from "@/lib/constants";
import { Table } from "@/lib/db";
import models from "@/lib/db/models";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tags, widgets] = await Promise.all([
    models
      .Categories()
      .select("slug", "updated_at")
      .where("count", ">", 0)
      .orderBy("count", "desc"),
    models
      .Widgets("w")
      .select("w.id", "w.key", "w.published_at")
      .joinRaw(
        `JOIN (
          SELECT DISTINCT ON (widget_id) *
          FROM ${Table.WidgetVersions}
          WHERE status = 'PUBLISHED'
            ORDER BY widget_id, created_at DESC
          ) wv ON w.id = wv.widget_id`,
      )
      .orderBy("w.created_at", "desc"),
  ]);

  const creators = await models
    .UserProfiles("p")
    .distinct("p.username", "p.updated_at")
    .join({ w: Table.Widgets }, "w.author_id", "p.user_id")
    .whereIn(
      "w.id",
      widgets.map((i) => i.id),
    );

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
