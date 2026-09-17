"use client";

import { APP_NAME, DEEP_LINK_BASE_URL, templateWidgets } from "@/lib/constants";
import { Body2, Button, Link } from "@fluentui/react-components";
import UploadList from "./list";
import { useDataStore } from "@/store/use-data-store";
import { Header } from "@/components/header";
import UploadFooter from "./list/list-footer";
import { useEffect, useState } from "react";
import UploadForm from "./form";
import UploadFormFooter from "./form/form-footer";
import { commands, IGetAllWidget } from "@/lib/commands";
import RootLayout from "@/components/root-layout";
import { useUploadStore } from "@/store/use-upload-store";
import { useSearchParams } from "next/navigation";

interface UploadPageProps {}

const UploadPage: React.FC<UploadPageProps> = () => {
  const [widgets, setWidgets] = useState<IGetAllWidget[]>([]);
  const { isInApp } = useDataStore();
  const uploadStep = useUploadStore((s) => s.uploadStep);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isInApp) return;

    const init = async () => {
      try {
        const widgets = await commands.getAllWidgets({ dir: "widgets" });
        const filtered = widgets.filter(
          (item) =>
            !(
              item.manifest.key in templateWidgets ||
              item.manifest.isGalleryWidget
            ),
        );
        setWidgets(filtered);

        const preselectedKeys = searchParams.getAll("key");
        useUploadStore.setState({
          uploadStep: "select",
          widgetUploads: {},
          selectedWidgets:
            preselectedKeys.length > 0
              ? filtered.filter((item) =>
                  preselectedKeys.includes(item.manifest.key),
                )
              : [],
          selectedWidget: null,
        });
      } catch (error) {
        alert("Something went wrong while fetching widgets");
        console.error(error);
      }
    };

    init();
  }, [isInApp, searchParams]);

  if (!isInApp) {
    return (
      <RootLayout>
        <main>
          <div className="flex flex-col main items-center justify-center gap-3">
            <Body2 className="mb-5">Open {APP_NAME} to upload widgets</Body2>
            <Button
              appearance="primary"
              as="a"
              href={DEEP_LINK_BASE_URL + "upload"}>
              Open {APP_NAME}
            </Button>
            <Link href="https://deltawidgets.com/download">Download</Link>
          </div>
        </main>
      </RootLayout>
    );
  }

  return (
    <main className="relative upload-form">
      <div className="sticky top-0 w-full z-99">
        <Header isDashboard isUpload />
      </div>
      <div style={{ minHeight: "var(--body-height)" }}>
        {uploadStep === "select" && <UploadList widgets={widgets} />}
        {uploadStep === "form" && <UploadForm />}
      </div>
      <div className="sticky bottom-0 w-full z-99">
        {uploadStep === "select" && <UploadFooter />}
        {uploadStep === "form" && <UploadFormFooter />}
      </div>
    </main>
  );
};

export default UploadPage;
