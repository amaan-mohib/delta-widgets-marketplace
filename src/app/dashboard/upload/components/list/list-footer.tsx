"use client";

import { useDataStore } from "@/store/use-data-store";
import { Button, Spinner, tokens } from "@fluentui/react-components";
import { useState } from "react";

interface UploadFooterProps {}

const UploadFooter: React.FC<UploadFooterProps> = () => {
  const [loading, setLoading] = useState(false);
  const selectedWidgets = useDataStore((state) => state.selectedWidgets);

  const onSubmit = async () => {
    try {
      if (selectedWidgets.length === 0) return;
      setLoading(true);
      await useDataStore.getState().initializeWidgetUpload(selectedWidgets);
      setLoading(false);
      useDataStore.setState({
        uploadStep: "form",
        selectedWidget: selectedWidgets[0],
      });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <footer
      className="h-(--header-height) border-t"
      style={{ background: tokens.colorNeutralBackground2 }}>
      <div className="flex items-center justify-between gap-8 h-full container mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-lg">Select widgets to upload</span>
        <Button
          appearance="primary"
          size="large"
          icon={loading ? <Spinner size="tiny" /> : null}
          disabled={selectedWidgets.length === 0 || loading}
          onClick={onSubmit}>
          Next
        </Button>
      </div>
    </footer>
  );
};

export default UploadFooter;
