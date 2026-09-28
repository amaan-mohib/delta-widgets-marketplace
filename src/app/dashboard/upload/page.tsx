import { Metadata } from "next";
import UploadPage from "./components";

export const instant = false;

export const metadata: Metadata = {
  title: "Upload",
};

const Upload = () => {
  return <UploadPage />;
};

export default Upload;
