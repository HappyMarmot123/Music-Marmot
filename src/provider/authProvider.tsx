"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Session,
  User,
  AuthChangeEvent,
  AuthError,
  Subscription,
} from "@supabase/supabase-js";
import { supabaseClient } from "@/api/supabaseClient";

/* 
  TODO: 
  Supabase Auth Google Login
  어떤 블로거가 설명을 되게 잘해주심
  https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth
*/

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // const getSession = async () => {
    //   try {
    //     const {
    //       data: { session: currentSession },
    //       error,
    //     } = await supabaseClient.auth.getSession();
    //     if (error) throw error;
    //     setSession(currentSession);
    //     setUser(currentSession?.user ?? null);
    //   } catch (error) {
    //     console.error(
    //       "Error getting session:",
    //       error instanceof Error ? error.message : error
    //     );
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsLoading(false);

        if (event === "SIGNED_IN" && currentSession?.user) {
          const { id: uid, email, user_metadata } = currentSession.user;
          if (!uid || !email) {
            console.error(
              "UID or Email is null from Supabase session on SIGNED_IN"
            );
            return;
          }

          try {
            // 유저 존재하면 생성 안하게 내부에서 막음
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
                console.log("User processed via API:");
              })
              .catch((error) => {
                console.error("Failed to Insert User:", error);
              });
          } catch (apiError) {
            console.error("Error calling user processing API:", apiError);
          }
        }
      }
    );
    const authListenerSubscription: Subscription | undefined =
      authListener?.subscription;

    return () => {
      authListenerSubscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.href,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error(
        "Error signing in with Google:",
        error instanceof AuthError ? error.message : error
      );
    }
  };

  const signInWithKakao = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: window.location.href,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error(
        "Error signing in with Kakao:",
        error instanceof AuthError ? error.message : error
      );
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error(
        "Error signing out:",
        error instanceof AuthError ? error.message : error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signInWithGoogle,
        signInWithKakao,
        signOut,
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
