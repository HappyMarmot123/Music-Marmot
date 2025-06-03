import { useState } from "react";
import { supabaseClient } from "@/api/supabaseClient";

enum Provider {
  GOOGLE = "google",
  KAKAO = "kakao",
}

class AuthStrategy {
  provider: Provider;
  constructor(provider: Provider) {
    this.provider = provider;
  }

  async signIn() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: this.provider,
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.href : "",
      },
    });
    if (error) {
      console.error(`Error signing in with ${this.provider}:`, error.message);
      throw error;
    }
  }
}

export class GoogleAuthStrategy extends AuthStrategy {
  constructor() {
    super(Provider.GOOGLE);
  }
}

export class KakaoAuthStrategy extends AuthStrategy {
  constructor() {
    super(Provider.KAKAO);
  }
}

export const useAuthActions = () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, signIn, signOut, GoogleAuthStrategy, KakaoAuthStrategy };
};
