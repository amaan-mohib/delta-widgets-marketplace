"use client";

import * as React from "react";
import {
  FluentProvider,
  SSRProvider,
  RendererProvider,
  createDOMRenderer,
  renderToStyleElements,
} from "@fluentui/react-components";
import { useServerInsertedHTML } from "next/navigation";
import { darkTheme } from "@/lib/themes";
import { useDataStore } from "@/store/useDataStore";
import { isTauri } from "@tauri-apps/api/core";

export function Providers({ children }: { children: React.ReactNode }) {
  const [renderer] = React.useState(() => createDOMRenderer());
  const didRenderRef = React.useRef(false);

  useServerInsertedHTML(() => {
    if (didRenderRef.current) {
      return;
    }
    didRenderRef.current = true;
    return <>{renderToStyleElements(renderer)}</>;
  });

  React.useEffect(() => {
    useDataStore.setState({
      isInApp: isTauri(),
    });
  }, []);

  return (
    <RendererProvider renderer={renderer}>
      <SSRProvider>
        <FluentProvider theme={darkTheme}>{children}</FluentProvider>
      </SSRProvider>
    </RendererProvider>
  );
}
