import { UserProfiles } from "@/lib/db";
import { IUser } from "@/lib/types/auth";
import { create } from "zustand";

interface IAuth {
  user: IUser | null;
  profile: Pick<
    UserProfiles,
    "username" | "created_at" | "donation_links"
  > | null;
  loading: boolean;
}

export const useAuth = create<IAuth>(() => ({
  user: null,
  loading: true,
  profile: null,
}));
