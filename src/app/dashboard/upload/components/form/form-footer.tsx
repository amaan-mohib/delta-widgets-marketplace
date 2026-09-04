"use client";

import { useDataStore } from "@/store/useDataStore";
import { Button, Spinner, tokens } from "@fluentui/react-components";
import { CheckmarkRegular, WarningRegular } from "@fluentui/react-icons";
import React, { useEffect, useMemo } from "react";
import { finalizeUpload, startUpload } from "../../actions";
import { message } from "@tauri-apps/plugin-dialog";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { commands } from "@/lib/commands";
import { validateForm } from "./utils";
import { useRouter } from "next/navigation";

interface UploadFormFooterProps {}

const UploadFormFooter: React.FC<UploadFormFooterProps> = () => {
  const selectedWidgets = useDataStore((state) => state.selectedWidgets);
  const widgetUploads = useDataStore((state) => state.widgetUploads);
  const selectedWidget = useDataStore((state) => state.selectedWidget);
  const router = useRouter();

  const { uploaded, notUploaded, warnings } = useMemo(() => {
    const uploaded: string[] = [],
      uploading: string[] = [],
      notUploaded: string[] = [],
      warnings: string[] = [];
    Object.entries(widgetUploads).forEach(([key, { state }]) => {
      switch (state) {
        case "DRAFT":
          notUploaded.push(key);
          break;
        case "WARNING":
          warnings.push(key);
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
    return { uploaded, uploading, warnings, notUploaded };
  }, [widgetUploads]);

  useEffect(() => {
    if (uploaded.length === selectedWidgets.length) {
      router.push("/dashboard/uploads");
    }
  }, [uploaded, selectedWidgets]);

  const onSubmit = async () => {
    if (!selectedWidget) return;

    const selectedWidgetKey = selectedWidget.manifest.key;

    const { values, state, manifest, versions } =
      widgetUploads[selectedWidgetKey];

    if (state === "UPLOADED" || state === "UPLOADING") return;

    const { setWidgetUploadErrors, setWidgetUploadState } =
      useDataStore.getState();

    setWidgetUploadState(selectedWidgetKey, "UPLOADING");

    const errors = await validateForm(
      values,
      versions.length > 0,
      manifest.file,
    );
    setWidgetUploadErrors(selectedWidgetKey, errors);

    if (errors.length > 0) {
      return;
    }

    await getCurrentWebviewWindow().setClosable(false).catch(console.error);

    try {
      setWidgetUploadState(selectedWidgetKey, "UPLOADING");

      const { uploadJobId, uploadJobs, widgetVersion, widgetKey } =
        await startUpload(values, {
          path: manifest.path,
          customAssets: manifest.customAssets,
          file: manifest.file,
          widgetType: manifest.widgetType,
        });
      await commands.uploadWidget({
        manifestPath: manifest.path,
        uploadJobs,
        uploadValues: {
          key: widgetKey,
          label: values.label,
          version: widgetVersion.version,
          description: values.description,
        },
      });
      await finalizeUpload(uploadJobId);

      setWidgetUploadState(selectedWidgetKey, "UPLOADED");

      const next = [...notUploaded, ...warnings].filter(
        (k) => k !== selectedWidgetKey,
      );
      if (next.length !== 0) {
        useDataStore.setState({
          selectedWidget: selectedWidgets.find(
            (w) => w.manifest.key === next[0],
          ),
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage = `Something went wrong while uploading widget: "${manifest.label}"`;
      message(errorMessage, { title: "Error", kind: "error" }).catch(
        console.error,
      );
      setWidgetUploadErrors(selectedWidgetKey, [
        { key: "global", message: errorMessage },
      ]);
    }

    await getCurrentWebviewWindow().setClosable(true).catch(console.error);
  };

  const nextIcon = useMemo(() => {
    const selectedWidgetKey = selectedWidget?.manifest?.key;
    if (!selectedWidgetKey || !widgetUploads[selectedWidgetKey]) {
      return { icon: null, disabled: false };
    }
    const status = widgetUploads[selectedWidgetKey].state;
    if (status === "UPLOADING") {
      return { icon: <Spinner size="tiny" />, disabled: true };
    }
    if (status === "UPLOADED") {
      return { icon: <CheckmarkRegular />, disabled: true };
    }
    if (status === "WARNING") {
      return { icon: <WarningRegular />, disabled: false };
    }
    return { icon: null, disabled: false };
  }, [selectedWidget, widgetUploads]);

  if (!selectedWidget) return null;

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
