import React, { useCallback, useState } from "react";
import { Heart } from "lucide-react";
import MyTooltip from "./myTooltip";
import { LikeButtonProps } from "../types/dataType";
import { TrackFavoriteAdapter } from "../lib/trackFavoriteAdapter";

// TODO: 빌더패턴 적용

class ClassNameBuilder {
  private classes: string[];
  constructor() {
    this.classes = [];
  }

  addBase(baseClass: string) {
    this.classes.push(baseClass);
    return this;
  }

  addCondition(condition: boolean | undefined, className: string) {
    if (condition) {
      this.classes.push(className);
    }
    return this;
  }

  build() {
    return this.classes.join(" ");
  }
}

export const LikeButton = React.memo(
  ({ track, user, isFavorite, toggleFavorite }: LikeButtonProps) => {
    if (!user) return null;

    const wrappedButtonOnClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const unifiedTrack = TrackFavoriteAdapter.unifyTrack(track);
        toggleFavorite(unifiedTrack.id);
      },
      // toggleFavorite: 함수 변경 여부로 클로저 캐싱하여 내부 상태 데이터 최신화
      [track, toggleFavorite]
    );

    const iconClassName = new ClassNameBuilder()
      .addBase("w-4 h-4")
      .addCondition(!user, "cursor-not-allowed")
      .addCondition(isFavorite, "text-pink-500 fill-pink-500/30")
      .addCondition(user, "hover:text-pink-500 transition-colors")
      .build();

    const wrappedButtonClassName = new ClassNameBuilder()
      .addBase("p-1")
      .addCondition(!user, "cursor-not-allowed")
      .build();

    return (
      <MyTooltip
        tooltipText={!user ? "You need to Login!" : ""}
        showTooltip={!user}
      >
        <button
          disabled={!user}
          className={wrappedButtonClassName}
          onClick={wrappedButtonOnClick}
        >
          <Heart className={iconClassName} />
        </button>
      </MyTooltip>
    );
  }
);
