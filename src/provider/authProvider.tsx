"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  Session,
  User,
  AuthChangeEvent,
  Subscription,
} from "@supabase/supabase-js";
import { supabaseClient } from "@/api/supabaseClient";
import { useAuthActions } from "@/hook/useAuthActions";
import { AuthProviderProps } from "@/type/dataType";
import { AuthContextType } from "@/type/dataType";

/* 
  TODO: 
  Supabase Auth Google Login
  어떤 블로거가 설명을 되게 잘해주심
  https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth
*/

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const authActions = useAuthActions();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        setIsLoadingSession(true);
        setUser(currentSession?.user || null);

        try {
          if (event === "SIGNED_IN" && currentSession?.user) {
            const { id: uid, email, user_metadata } = currentSession.user;
            if (!uid || !email) {
              console.error(
                "UID or Email is null from Supabase session on SIGNED_IN"
              );
              return;
            }

            const userToCreate = {
              uid: uid,
              avatar_url: user_metadata?.avatar_url,
              email: email,
              full_name: user_metadata?.full_name,
            };

            await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userToCreate),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
              })
              .catch((error) => {
                console.error("Failed to Insert User:", error);
              });
          }
        } catch (apiError) {
          console.error("Error calling user processing API:", apiError);
        } finally {
          setIsLoadingSession(false);
        }
      }
    );

    const authListenerSubscription: Subscription | undefined =
      authListener?.subscription;

    return () => {
      authListenerSubscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoadingSession,
        authActions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
