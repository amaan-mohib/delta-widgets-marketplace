"use client";

import { useDataStore } from "@/store/useDataStore";
import { Button, tokens } from "@fluentui/react-components";

interface UploadFooterProps {}

const UploadFooter: React.FC<UploadFooterProps> = () => {
  const selectedWidgets = useDataStore((state) => state.selectedWidgets);

  const onSubmit = () => {
    if (selectedWidgets.length === 0) return;
    useDataStore.setState({
      uploadStep: "form",
      selectedWidgetKey: selectedWidgets[0].manifest.key,
    });
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
          disabled={selectedWidgets.length === 0}
          onClick={onSubmit}>
          Next
        </Button>
      </div>
    </footer>
  );
};

export default UploadFooter;
