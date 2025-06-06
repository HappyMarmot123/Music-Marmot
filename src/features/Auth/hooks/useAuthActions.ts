import { useState } from "react";
import { supabaseClient } from "@/app/api/supabase/supabaseClient";
import { AuthStrategy } from "@/shared/types/dataType";

enum Provider {
  GOOGLE = "google",
  KAKAO = "kakao",
}

class AuthStrategyImpl implements AuthStrategy {
  private provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  async signIn() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: this.provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error(`${this.provider} signIn error:`, error);
    }
  }
}

export const GoogleAuthStrategy = new AuthStrategyImpl(Provider.GOOGLE);
export const KakaoAuthStrategy = new AuthStrategyImpl(Provider.KAKAO);

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (strategy: AuthStrategy) => {
    setIsLoading(true);
    try {
      await strategy.signIn();
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("signOut error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signIn,
    signOut,
    GoogleAuthStrategy,
    KakaoAuthStrategy,
  };
}
