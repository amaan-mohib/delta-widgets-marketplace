import { getAuthUser } from "@/app/actions";
import models from "@/lib/db/models";
import { notFound } from "next/navigation";
import Hero from "./components/hero";
import { Table } from "@/lib/db";
import Screenshots from "./components/screenshots";
import Description from "./components/description";
import AssetsSection from "./components/assets";

const WidgetPage = async (props: PageProps<"/widget/[...key]">) => {
  const user = await getAuthUser();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { key } = params;
  const widgetKey = key.join("/");
  const widget = await models.Widgets().where("key", widgetKey).first();
  if (!widget) {
    notFound();
  }
  const authorProfile = user
    ? user.profile
    : await models.UserProfiles().where("user_id", widget.author_id).first();
  if (!authorProfile) {
    notFound();
  }
  const versions = await models
    .WidgetVersions()
    .where("widget_id", widget.id)
    .orderBy("revision", "desc");
  const approvedVersion = versions.find((v) => v.status === "PUBLISHED");
  const isWidgetAuthor = user ? user.id === widget.author_id : false;
  const latestVersion = isWidgetAuthor ? versions[0] : approvedVersion;

  if ((!approvedVersion && !isWidgetAuthor) || !latestVersion) {
    notFound();
  }

  let selectedVersion = latestVersion;
  const versionParam = searchParams["version"];
  const version = versionParam
    ? versions.find((item) => item.version === versionParam)
    : null;
  if (isWidgetAuthor && version) {
    selectedVersion = version;
  }

  const assets = await models
    .Assets("a")
    .select("a.id", "a.file_name", "a.size", "a.src", "a.asset_type")
    .join({ w: Table.WidgetVersionAssets }, "a.id", "w.asset_id")
    .where("w.widget_version_id", selectedVersion.id)
    .orderBy("w.sort_order");

  const likes = await models
    .WidgetLikes()
    .select("widget_id as count")
    .count("widget_id")
    .where("widget_id", widget.id)
    .groupBy("widget_id")
    .first();

  return (
    <div className="py-5">
      <Screenshots
        screenshots={assets.filter((a) => a.asset_type === "SCREENSHOT")}
      />
      <Hero
        isAuthor={isWidgetAuthor}
        widget={widget}
        creator={authorProfile.username}
        likes={Number(likes?.count ?? 0)}
        version={selectedVersion}
      />
      <Description description={selectedVersion.description || ""} />
      {selectedVersion.changelog && (
        <Description
          description={selectedVersion.changelog}
          title="What's new"
        />
      )}
      <AssetsSection
        assets={assets.filter((a) => a.asset_type !== "SCREENSHOT")}
      />
    </div>
  );
};

export default WidgetPage;
