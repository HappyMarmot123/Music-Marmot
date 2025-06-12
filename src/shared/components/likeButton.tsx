import React, { useCallback, useState } from "react";
import { Heart } from "lucide-react";
import MyTooltip from "./myTooltip";
import { LikeButtonProps } from "../types/dataType";
import OnclickEffect from "./onclickEffect";

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
    const isFavoriteThis = useCallback(
      () =>
        [...isFavorite].find((item) => item === track.asset_id) !== undefined,
      [isFavorite, track]
    );

    const [playingLottieTrackId, setPlayingLottieTrackId] = useState<
      string | null
    >(null);

    const wrappedButtonOnClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!user) return;
        e.stopPropagation();
        toggleFavorite();
        setPlayingLottieTrackId(track.asset_id);
      },
      [user, track]
    );

    const iconClassName = new ClassNameBuilder()
      .addBase("w-4 h-4")
      .addCondition(!user, "cursor-not-allowed")
      .addCondition(isFavoriteThis(), "text-pink-500 fill-pink-500/30")
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
        <OnclickEffect
          play={playingLottieTrackId === track.asset_id}
          onComplete={() => setPlayingLottieTrackId(null)}
        />
      </MyTooltip>
    );
  }
);
