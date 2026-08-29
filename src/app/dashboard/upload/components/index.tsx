"use client";

import { APP_NAME, DEEP_LINK_BASE_URL } from "@/lib/constants";
import { Button } from "@fluentui/react-components";
import { isTauri } from "@tauri-apps/api/core";
import { useMemo } from "react";

interface UploadPageProps {}

const UploadPage: React.FC<UploadPageProps> = () => {
  const isInApp = useMemo(() => {
    return isTauri();
  }, []);

  return (
    <main>
      {!isInApp && (
        <div className="flex h-full items-center justify-center main">
          <Button as="a" href={DEEP_LINK_BASE_URL + "upload"}>
            Open {APP_NAME}
          </Button>
        </div>
      )}
    </main>
  );
};

export default UploadPage;
