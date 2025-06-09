"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  type Session,
  type User,
  type AuthChangeEvent,
  type Subscription,
} from "@supabase/supabase-js";
import { supabaseClient } from "@/app/api/supabase/supabaseClient";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { AuthProviderProps, AuthContextType } from "@/shared/types/dataType";
//
/* 
  TODO: 
  Supabase Auth Google Login
  어떤 블로거가 설명을 되게 잘해주심
  https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth
*/

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const authActions = useAuthActions();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoadingSession(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      isLoadingSession,
      setSession,
      authActions,
    }),
    [session, user, isLoadingSession, setSession, authActions]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
