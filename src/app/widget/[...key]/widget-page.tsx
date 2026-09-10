import { getAuthUser } from "@/app/actions";
import { notFound } from "next/navigation";
import Hero from "./components/hero";
import Screenshots from "./components/screenshots";
import Description from "./components/description";
import AssetsSection from "./components/assets";
import { getWidget } from "./actions";
import Approval from "./components/approval";

const WidgetPage = async (props: PageProps<"/widget/[...key]">) => {
  const user = await getAuthUser();
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { key } = params;
  const widgetKey = key.join("/");
  const isAdmin = user?.role === "admin";

  const data = await getWidget({
    widgetKey,
    userId: user?.id,
    versionParam: searchParams["version"] as string | undefined,
    isAdmin,
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

  const fromApproval = searchParams.approval === "true";

  return (
    <div className="flex">
      <div className="py-5 flex-1">
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
      {(isAdmin || isWidgetAuthor) && (
        <div className="py-5 px-2.5">
          <Approval
            widgetKey={widgetKey}
            isAdmin={isAdmin}
            widgetVersion={selectedVersion}
            fromApproval={fromApproval}
          />
        </div>
      )}
    </div>
  );
};

export default WidgetPage;
