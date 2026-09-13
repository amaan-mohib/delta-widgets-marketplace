"use server";
import { auth } from "@/lib/auth/server";
import { Table, Widgets, WidgetVersions } from "@/lib/db";
import models from "@/lib/db/models";
import { connection } from "next/server";

export const test = async () => {
  const templates = [
    {
      key: "datetime",
      label: "Date & Time",
      creator: "deltawidgets",
      views: 1213,
      downloads: 1000,
      thumbnail: "/templates/datetime/thumb.png",
    },
    {
      key: "media",
      label: "Date & Time",
      creator: "deltawidgets",
      views: 1213,
      downloads: 1000,
      thumbnail: "/templates/media/thumb.png",
    },
    {
      key: "media-viz",
      label: "Date & Time",
      creator: "deltawidgets",
      views: 1213,
      downloads: 1000,
      thumbnail: "/templates/media-viz/thumb.png",
    },
    {
      key: "weather",
      label: "Date & Time",
      creator: "deltawidgets",
      views: "1.2k",
      downloads: "10k",
      thumbnail: "/templates/weather/thumb.png",
    },
    {
      key: "visualizer",
      label: "Date & Time",
      creator: "deltawidgets",
      views: 1213,
      downloads: 100000000,
      thumbnail: "/templates/visualizer/thumb.png",
    },
  ];
  return new Promise<typeof templates>((r) =>
    setTimeout(() => {
      return r(templates);
    }, 100),
  );
};

export const getWidgets = async (
  sortBy: "likes" | "published_at" | "download_count",
) => {
  const widgets: (Pick<
    Widgets,
    "id" | "key" | "download_count" | "widget_type" | "likes" | "published_at"
  > &
    Pick<WidgetVersions, "label" | "version" | "status"> & {
      screenshot_src: string;
      version_id: number;
      creator: string;
    })[] = await models
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
    .join({ p: Table.UserProfiles }, "p.user_id", "w.author_id")
    .orderBy(`w.${sortBy}`, "desc")
    .limit(20);

  return widgets;
};

export const getUserProfile = async (userId: string) => {
  return await models.UserProfiles().where("user_id", userId).first();
};

export const handleOAuthSignInServer = async (
  provider: "google" | "github",
  callbackURL?: string | null,
) => {
  try {
    await auth.signIn.social({
      provider,
      callbackURL: callbackURL || "/dashboard",
      newUserCallbackURL: "/dashboard/welcome",
      errorCallbackURL: "/error",
    });
  } catch (error) {
    console.error("OAuth sign-in error:", error);
  }
};

export async function getAuthUser() {
  try {
    await connection();
    const { data: session } = await auth.getSession();

    if (!session?.user) return null;

    const user = session.user;
    const profile = await models
      .UserProfiles()
      .select("username", "donation_links", "created_at")
      .where("user_id", user.id)
      .first();
    return {
      ...user,
      profile,
    };
  } catch (error) {
    return null;
  }
}

export const getDonationLinks = async (username: string) => {
  return await models
    .UserProfiles()
    .select("donation_links")
    .where("username", username)
    .first();
};

export const sendMixpanelEvent = async (
  event: string,
  properties: Record<any, any> = {},
) => {
  try {
    await fetch("https://api.mixpanel.com/track?ip=0", {
      method: "POST",
      headers: {
        accept: "text/plain",
        "content-type": "application/json",
      },
      body: JSON.stringify([
        {
          event,
          properties: {
            token: process.env.MIXPANEL_TOKEN,
            env: process.env.NODE_ENV,
            ...(properties || {}),
          },
        },
      ]),
    });
  } catch (error) {
    console.error(error);
  }
};
