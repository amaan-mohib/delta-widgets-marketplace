"use client";

import { useDataStore } from "@/store/useDataStore";
import { isTauri } from "@tauri-apps/api/core";
import React, { useEffect } from "react";

interface AppProviderProps {}

const AppProvider: React.FC<AppProviderProps> = () => {
  useEffect(() => {
    useDataStore.setState({
      isInApp: isTauri(),
    });
  }, []);

  return null;
};

export default AppProvider;
