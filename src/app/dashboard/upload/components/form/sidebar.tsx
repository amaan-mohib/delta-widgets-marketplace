"use client";

import { useDataStore } from "@/store/use-data-store";
import { Button, Spinner } from "@fluentui/react-components";
import {
  ArrowLeftRegular,
  CheckmarkRegular,
  WarningRegular,
} from "@fluentui/react-icons";
import React, { useCallback } from "react";

interface UploadFormSidebarProps {}

const UploadFormSidebar: React.FC<UploadFormSidebarProps> = () => {
  const selectedWidgets = useDataStore((s) => s.selectedWidgets);
  const selectedWidget = useDataStore((s) => s.selectedWidget);
  const widgetUploads = useDataStore((s) => s.widgetUploads);

  const getStateWidgetIcon = useCallback(
    (key: string) => {
      const state = widgetUploads[key].state;
      return state === "UPLOADED" ? (
        <CheckmarkRegular />
      ) : state === "UPLOADING" ? (
        <Spinner size="extra-tiny" />
      ) : state === "WARNING" ? (
        <WarningRegular />
      ) : null;
    },
    [widgetUploads],
  );

  return (
    <div className="border-r h-(--body-height) w-(--widget-list-sidebar) overflow-auto sticky top-(--header-height) left-0 p-2 pl-0">
      <Button
        onClick={() => {
          useDataStore.setState({ uploadStep: "select" });
        }}
        icon={<ArrowLeftRegular />}
        appearance="subtle"
        className="w-full"
        style={{ justifyContent: "flex-start", marginBottom: 10 }}>
        Back
      </Button>
      {selectedWidgets.map((item) => (
        <Button
          key={item.manifest.key}
          onClick={() => {
            useDataStore.setState({ selectedWidget: item });
          }}
          icon={getStateWidgetIcon(item.manifest.key)}
          className="w-full"
          appearance={
            selectedWidget?.manifest?.key === item.manifest.key
              ? "primary"
              : "subtle"
          }>
          {item.manifest.label}
        </Button>
      ))}
    </div>
  );
};

export default UploadFormSidebar;
