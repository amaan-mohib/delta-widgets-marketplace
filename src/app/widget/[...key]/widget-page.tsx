import { getAuthUser } from "@/app/actions";
import { notFound } from "next/navigation";
import Hero from "./components/hero";
import Screenshots from "./components/screenshots";
import Description from "./components/description";
import AssetsSection from "./components/assets";
import { getWidget } from "./actions";

const WidgetPage = async (props: PageProps<"/widget/[...key]">) => {
  const user = await getAuthUser();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { key } = params;
  const widgetKey = key.join("/");

  const data = await getWidget({
    widgetKey,
    userId: user?.id,
    versionParam: searchParams["version"] as string | undefined,
  });
  if (!data) {
    notFound();
  }
  const {
    widget,
    isWidgetAuthor,
    assets,
    selectedVersion,
    creator,
    versions,
    tags,
  } = data;

  return (
    <div className="py-5">
      <Screenshots
        screenshots={assets.filter((a) => a.asset_type === "SCREENSHOT")}
      />
      <Hero
        isAuthor={isWidgetAuthor}
        widget={widget}
        creator={creator}
        likes={Number(widget.likes ?? 0)}
        version={selectedVersion}
        versions={versions}
        tags={tags}
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
