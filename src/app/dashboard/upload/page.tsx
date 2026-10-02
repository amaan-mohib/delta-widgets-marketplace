import { Metadata } from "next";
import UploadPage from "./components";
import { Suspense } from "react";

export const instant = false;

export const metadata: Metadata = {
  title: "Upload",
};

const Upload = async () => {
  return (
    <Suspense>
      <UploadPage />
    </Suspense>
  );
};

export default Upload;
