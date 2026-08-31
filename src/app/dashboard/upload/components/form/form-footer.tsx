"use client";

import { useDataStore } from "@/store/useDataStore";
import { Button, Spinner, tokens } from "@fluentui/react-components";
import { CheckmarkRegular } from "@fluentui/react-icons";
import React, { useMemo, useState } from "react";

interface UploadFormFooterProps {}

const UploadFormFooter: React.FC<UploadFormFooterProps> = () => {
  const [loading, setLoading] = useState(false);
  const selectedWidgets = useDataStore((state) => state.selectedWidgets);
  const widgetUploads = useDataStore((state) => state.widgetUploads);
  const selectedWidgetKey = useDataStore((state) => state.selectedWidgetKey);

  const { uploaded, uploading, notUploaded } = useMemo(() => {
    const uploaded: string[] = [],
      uploading: string[] = [],
      notUploaded: string[] = [];
    Object.entries(widgetUploads).forEach(([key, { state }]) => {
      switch (state) {
        case "DRAFT":
          notUploaded.push(key);
          break;
        case "UPLOADING":
          uploading.push(key);
          break;
        case "UPLOADED":
          uploaded.push(key);
          break;
        default:
          break;
      }
    });
    return { uploaded, uploading, notUploaded };
  }, [widgetUploads]);

  const onSubmit = async () => {
    // try {
    //   if (selectedWidgets.length === 0) return;
    //   setLoading(true);
    //   await useDataStore.getState().initializeWidgetUpload(selectedWidgets);
    //   setLoading(false);
    //   useDataStore.setState({
    //     uploadStep: "form",
    //     selectedWidgetKey: selectedWidgets[0].manifest.key,
    //   });
    // } catch (error) {
    //   setLoading(false);
    // }
  };

  const nextIcon = useMemo(() => {
    if (loading || uploading.includes(selectedWidgetKey!))
      return { icon: <Spinner size="tiny" />, disabled: true };
    if (uploaded.includes(selectedWidgetKey!))
      return { icon: <CheckmarkRegular />, disabled: true };
    return { icon: null, disabled: false };
  }, [selectedWidgetKey, loading, uploaded, uploading]);

  if (!selectedWidgetKey) return null;

  return (
    <footer
      className="h-(--header-height) border-t"
      style={{ background: tokens.colorNeutralBackground2 }}>
      <div className="flex items-center justify-between gap-8 h-full container mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-lg">
          Fill the required information ({uploaded.length}/
          {selectedWidgets.length})
        </span>
        <Button
          appearance="primary"
          size="large"
          {...nextIcon}
          onClick={onSubmit}>
          Upload
        </Button>
      </div>
    </footer>
  );
};

export default UploadFormFooter;
