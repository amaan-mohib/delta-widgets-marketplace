"use client";

import { getUserProfile } from "@/app/actions";
import { authClient } from "@/lib/auth/client";
import { IUser } from "@/lib/types/auth";
import { useAuth } from "@/store/use-auth";
import React, { useEffect, useRef } from "react";

interface AuthProviderProps {}

const AuthProvider: React.FC<AuthProviderProps> = () => {
  const session = authClient.useSession();
  const lastFetchedIdRef = useRef<string | null>(null);

  const setUser = async (user: IUser) => {
    try {
      useAuth.setState({ user: null, profile: null, loading: true });
      const profile = await getUserProfile(user.id);
      useAuth.setState({
        user,
        profile: profile || null,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      useAuth.setState({ user: null, profile: null, loading: false });
    }
  };

  useEffect(() => {
    if (session.isPending) {
      useAuth.setState({ user: null, profile: null, loading: true });
      return;
    }

    const user = session.data?.user;
    if (!user) {
      lastFetchedIdRef.current = null;
      useAuth.setState({ user: null, profile: null, loading: false });
      return;
    }

    if (lastFetchedIdRef.current === user.id) return;

    lastFetchedIdRef.current = user.id;
    setUser(user);
  }, [session.data, session.isPending]);

  return null;
};

export default AuthProvider;
