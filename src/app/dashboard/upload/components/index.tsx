"use client";

import { useDataStore } from "@/store/use-data-store";
import UploadInApp from "./upload-in-app";
import UploadInBrowser from "./upload-in-browser";

interface UploadPageProps {}

const UploadPage: React.FC<UploadPageProps> = () => {
  const isInApp = useDataStore((s) => s.isInApp);

  if (!isInApp) {
    return <UploadInBrowser />;
  }

  return <UploadInApp />;
};

export default UploadPage;
