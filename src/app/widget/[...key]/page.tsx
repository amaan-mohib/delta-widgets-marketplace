import RootLayout from "@/components/root-layout";
import { Suspense } from "react";
import WidgetPage from "./widget-page";
import Loader from "../../../components/loader";
import { Metadata, ResolvingMetadata } from "next";
import { getWidget } from "./actions";

export async function generateMetadata(
  props: PageProps<"/widget/[...key]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const key = (await props.params).key;
  const searchParams = await props.searchParams;
  const widgetKey = key.join("/");

  const data = await getWidget({
    widgetKey,
    versionParam: searchParams["version"] as string | undefined,
  });

  if (!data) return {};

  const parentMeta = await parent;

  const { assets, tags, creator, selectedVersion } = data;

  const description = `Check out ${selectedVersion.label} by @${creator.username} on Delta Widgets: ${selectedVersion.description}`;
  const screenshot = assets.filter((a) => a.asset_type === "SCREENSHOT")[0];

  return {
    title: selectedVersion.label,
    description,
    keywords: [...tags, ...(parentMeta.keywords || [])],
    creator: creator.username,
    authors: [{ name: creator.username }],
    openGraph: {
      ...parentMeta.openGraph,
      title: selectedVersion.label,
      description,
      images: [...(parentMeta.openGraph?.images || []), screenshot.src],
    },
    twitter: {
      ...parentMeta.twitter,
      title: selectedVersion.label,
      description,
      images: [...(parentMeta.twitter?.images || []), screenshot.src],
    },
  };
}

const Widget = async (props: PageProps<"/widget/[...key]">) => {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<Loader />}>
          <WidgetPage {...props} />
        </Suspense>
      </main>
    </RootLayout>
  );
};

export default Widget;
