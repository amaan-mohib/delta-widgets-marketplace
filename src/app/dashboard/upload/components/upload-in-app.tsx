"use client";

import { templateWidgets } from "@/lib/constants";
import UploadList from "./list";
import { Header } from "@/components/header";
import UploadFooter from "./list/list-footer";
import { useEffect, useState } from "react";
import UploadForm from "./form";
import UploadFormFooter from "./form/form-footer";
import { commands, IGetAllWidget } from "@/lib/commands";
import { useUploadStore } from "@/store/use-upload-store";
import { useSearchParams } from "next/navigation";

interface UploadInAppProps {}

const UploadInApp: React.FC<UploadInAppProps> = () => {
  const [widgets, setWidgets] = useState<IGetAllWidget[]>([]);
  const uploadStep = useUploadStore((s) => s.uploadStep);
  const searchParams = useSearchParams();

  useEffect(() => {
    const init = async () => {
      try {
        const widgets = await commands.getAllWidgets({ dir: "widgets" });
        const filtered = widgets
          .filter(
            (item) =>
              !(
                item.manifest.key in templateWidgets ||
                item.manifest.isGalleryWidget
              ),
          )
          .sort((a, b) => a.manifest.label.localeCompare(b.manifest.label));
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
  }, []);

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

export default UploadInApp;
