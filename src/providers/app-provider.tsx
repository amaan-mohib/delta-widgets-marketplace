"use client";

import { getClientId } from "@/lib/utils";
import { useDataStore } from "@/store/use-data-store";
import { isTauri } from "@tauri-apps/api/core";
import React, { useEffect } from "react";

interface AppProviderProps {}

const AppProvider: React.FC<AppProviderProps> = () => {
  const init = async () => {
    const isInApp = isTauri();
    if (isInApp) {
      const clientId = await getClientId();
      return {
        isInApp,
        clientId: clientId || null,
      };
    }
    return {
      isInApp: false,
      clientId: null,
    };
  };
  useEffect(() => {
    init().then((data) => {
      useDataStore.setState(data);
    });
  }, []);

  return null;
};

export default AppProvider;
