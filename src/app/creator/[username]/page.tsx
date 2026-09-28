import RootLayout from "@/components/root-layout";
import { Suspense } from "react";
import Loader from "../../../components/loader";
import models from "@/lib/db/models";
import { NeonAuthUser, Table, UserProfiles } from "@/lib/db";
import { notFound } from "next/navigation";
import CreatorPage from "./components/creator-page";
import { WidgetWithCreator } from "@/lib/types/server";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: PageProps<"/creator/[username]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const username = (await params).username;
  const creator: Pick<NeonAuthUser, "name" | "image"> &
    Pick<UserProfiles, "username"> = await models
    .NeonAuthUser("u")
    .select("u.name", "u.image", "p.username")
    .join({ p: Table.UserProfiles }, "u.id", "p.user_id")
    .where("p.username", username)
    .first();
  if (!creator) {
    return {};
  }

  const parentMeta = await parent;
  const title = creator.name;
  const description = `See widgets published by ${creator.name} (@${username}) on Delta Widgets.`;

  return {
    title,
    description,
    openGraph: {
      ...parentMeta.openGraph,
      title,
      description,
      images: [
        ...(parentMeta.openGraph?.images || []),
        ...(creator.image ? [creator.image] : []),
      ],
    },
    twitter: {
      ...parentMeta.twitter,
      title,
      description,
      images: [
        ...(parentMeta.twitter?.images || []),
        ...(creator.image ? [creator.image] : []),
      ],
    },
  };
}

const Page = async (props: PageProps<"/creator/[username]">) => {
  const { username } = await props.params;
  const creator: Pick<NeonAuthUser, "name" | "email" | "image"> &
    Pick<UserProfiles, "username" | "donation_links"> = await models
    .NeonAuthUser("u")
    .select("u.name", "u.email", "u.image", "p.username", "p.donation_links")
    .join({ p: Table.UserProfiles }, "u.id", "p.user_id")
    .where("p.username", username)
    .first();
  if (!creator) {
    notFound();
  }

  const searchParams = await props.searchParams;

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
      .join({ wv: Table.WidgetVersions }, "wv.id", "w.latest_version_id")
      .where("wv.status", "PUBLISHED")
      .join({ p: Table.UserProfiles }, "w.author_id", "p.user_id")
      .where("p.username", username)
      .orderBy("w.created_at", "desc")
      .limit(limit)
      .offset(offset) as unknown as WidgetWithCreator[],
    models
      .WidgetVersions("wv")
      .join({ w: Table.Widgets }, "w.id", "wv.widget_id")
      .join({ p: Table.UserProfiles }, "w.author_id", "p.user_id")
      .count("wv.id")
      .where("p.username", username)
      .andWhere("wv.status", "PUBLISHED")
      .first(),
  ]);

  return (
    <div className="py-5">
      <CreatorPage
        creator={creator}
        widgets={widgets}
        total={Number(total?.count ?? 0)}
        page={page}
      />
    </div>
  );
};

const Creator = async (props: PageProps<"/creator/[username]">) => {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<Loader />}>
          <Page {...props} />
        </Suspense>
      </main>
    </RootLayout>
  );
};

export default Creator;
