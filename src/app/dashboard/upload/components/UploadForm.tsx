"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useDataStore } from "@/store/useDataStore";
import { Button } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import { useMemo } from "react";

interface UploadFormProps {}

const UploadForm: React.FC<UploadFormProps> = () => {
  const { selectedWidgets, selectedWidgetKey } = useDataStore();

  const widget = useMemo(() => {
    return selectedWidgets.find((item) => item.manifest.key);
  }, [selectedWidgetKey]);

  return (
    <div>
      <div className="border-r h-(--body-height) w-(--widget-list-sidebar) overflow-auto absolute left-0 p-2">
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
            onClick={() => {
              useDataStore.setState({ selectedWidgetKey: item.manifest.key });
            }}
            className="w-full"
            key={item.manifest.key}
            appearance={
              selectedWidgetKey === item.manifest.key ? "primary" : "subtle"
            }>
            {item.manifest.label}
          </Button>
        ))}
      </div>
      <div className="pl-(--widget-list-sidebar) w-full">
        <div className="p-2">
          <div className="border" style={{ width: 400, height: 400 }}>
            <SimpleEditor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
