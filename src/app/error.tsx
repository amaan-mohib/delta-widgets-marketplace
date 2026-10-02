"use client"; // Error boundaries must be Client Components

import RootLayout from "@/components/root-layout";
import { Button } from "@fluentui/react-components";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <RootLayout>
      <main className="flex flex-col gap-2 w-full items-center justify-center">
        <h2>Something went wrong!</h2>
        <Button
          appearance="primary"
          onClick={
            // Attempt to recover by re-fetching and re-rendering the segment
            () => retry()
          }>
          Try again
        </Button>
      </main>
    </RootLayout>
  );
}
