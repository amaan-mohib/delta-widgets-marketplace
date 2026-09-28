"use client"; // Error boundaries must be Client Components

import RootLayout from "@/components/root-layout";
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
      <main>
        <h2>Something went wrong!</h2>
        <button
          onClick={
            // Attempt to recover by re-fetching and re-rendering the segment
            () => retry()
          }>
          Try again
        </button>
      </main>
    </RootLayout>
  );
}
