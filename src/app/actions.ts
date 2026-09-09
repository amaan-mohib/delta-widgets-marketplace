"use server";
import { auth } from "@/lib/auth/server";
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
      .select("username", "created_at")
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
