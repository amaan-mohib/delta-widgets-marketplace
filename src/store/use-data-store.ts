"use client";

import { create } from "zustand";

interface IDataStore {
  isInApp: boolean;
  clientId: string | null;
}

export const useDataStore = create<IDataStore>((set, get) => ({
  isInApp: false,
  clientId: null,
}));
