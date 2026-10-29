"use client";

import { APP_NAME, DEEP_LINK_BASE_URL } from "@/lib/constants";
import { Body2, Button, Link } from "@fluentui/react-components";
import RootLayout from "@/components/root-layout";

interface UploadInBrowserProps {}

const UploadInBrowser: React.FC<UploadInBrowserProps> = () => {
  return (
    <RootLayout>
      <main>
        <div className="flex flex-col main items-center justify-center gap-3">
          <Body2 className="mb-5">Open {APP_NAME} to upload widgets</Body2>
          <Button
            appearance="primary"
            as="a"
            href={DEEP_LINK_BASE_URL + "upload"}>
            Open {APP_NAME}
          </Button>
          <Link href="https://deltawidgets.com/download">Download</Link>
        </div>
      </main>
    </RootLayout>
  );
};

export default UploadInBrowser;
