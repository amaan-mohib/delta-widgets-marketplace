"use client";

import { Button } from "@fluentui/react-components";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { IconBrandDiscord, IconUpload } from "@tabler/icons-react";
import { useMemo } from "react";
import { isTauri } from "@tauri-apps/api/core";

export function Header() {
  const isInApp = useMemo(() => {
    return isTauri();
  }, []);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center space-x-3">
              <img
                src="/delta-widgets-icon.png"
                alt={APP_NAME}
                className="h-8 w-8"
              />
              <h1 className="text-2xl hidden sm:block font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent [&:not(:has(.gradient-fallback))]:text-foreground">
                {APP_NAME}
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              as="a"
              target="_blank"
              href="https://docs.deltawidgets.com/"
              appearance="subtle"
              style={{ minWidth: "fit-content" }}>
              Docs
            </Button>
            <Button
              as="a"
              appearance="subtle"
              icon={<IconBrandDiscord />}
              href="https://discord.gg/wDE8KNx8fB"
              target="_blank"
              rel="noopener noreferrer"
            />
            {isInApp ? (
              <Button
                as="a"
                appearance="primary"
                href="/dashboard/upload"
                icon={<IconUpload />}>
                Upload
              </Button>
            ) : (
              <Button as="a" href="https://deltawidgets.com/download">
                Get {APP_NAME}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
