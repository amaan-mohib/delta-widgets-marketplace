import { UserProfiles } from "@/lib/db";
import { create } from "zustand";

interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
}

interface IAuth {
  user: IUser | null;
  profile: Pick<UserProfiles, "username" | "created_at"> | null;
  loading: boolean;
}

export const useAuth = create<IAuth>(() => ({
  user: null,
  loading: true,
  profile: null,
}));
