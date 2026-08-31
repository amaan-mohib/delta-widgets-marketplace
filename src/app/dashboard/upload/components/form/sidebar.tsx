"use client";

import { useDataStore } from "@/store/useDataStore";
import { Button, Spinner } from "@fluentui/react-components";
import { ArrowLeftRegular, CheckmarkRegular } from "@fluentui/react-icons";
import React from "react";

interface UploadFormSidebarProps {}

const UploadFormSidebar: React.FC<UploadFormSidebarProps> = () => {
  const selectedWidgets = useDataStore((s) => s.selectedWidgets);
  const selectedWidgetKey = useDataStore((s) => s.selectedWidgetKey);
  const state = useDataStore((s) =>
    s.selectedWidgetKey
      ? (s.widgetUploads[s.selectedWidgetKey]?.state ?? null)
      : null,
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
            useDataStore.setState({ selectedWidgetKey: item.manifest.key });
          }}
          icon={
            state === "UPLOADED" ? (
              <CheckmarkRegular />
            ) : state === "UPLOADING" ? (
              <Spinner size="extra-tiny" />
            ) : null
          }
          className="w-full"
          appearance={
            selectedWidgetKey === item.manifest.key ? "primary" : "subtle"
          }>
          {item.manifest.label}
        </Button>
      ))}
    </div>
  );
};

export default UploadFormSidebar;
