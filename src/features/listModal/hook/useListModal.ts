import { useEffect, useMemo, useState } from "react";
import { useAudioPlayer } from "@/app/providers/audioPlayerProvider";
import { useAuth } from "@/app/providers/authProvider";
import { CloudinaryResource, likeType } from "@/shared/types/dataType";
import useCloudinaryStore from "@/app/store/cloudinaryStore";
import { useFavorites } from "@/features/listModal/hook/useFavorites";
import { useVolumeControl } from "@/features/player/hook/useVolumeControl";
import { handleOnLike } from "@/shared/lib/util";

export const useListModal = () => {
  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);
  const isLoadingCloudinary = useCloudinaryStore(
    (state) => state.isLoadingCloudinary
  );

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    volume,
    isMuted,
    togglePlayPause,
    nextTrack,
    prevTrack,
    setVolume,
    setLiveVolume,
    toggleMute,
    handleSelectTrack,
    analyserNode,
  } = useAudioPlayer();

  const { user } = useAuth();
  const { data: favorites, isLoading: isLoadingFavorites } = useFavorites();

  const [trackList, setTrackList] = useState<CloudinaryResource[]>([]);
  const [isCursorHidden] = useState(true);
  const [activeButton, setActiveButton] = useState("available");
  const [listTitleText, setListTitleText] = useState("Available Now");
  const [displayedTrackList, setDisplayedTrackList] = useState<
    CloudinaryResource[]
  >([]);
  const [animateLikeForAssetId, setAnimateLikeForAssetId] = useState<
    string | null
  >(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLiked, setIsLiked] = useState<likeType[]>([]);

  useEffect(() => {
    if (cloudinaryData) {
      setTrackList(cloudinaryData);
    }
  }, [cloudinaryData]);

  useEffect(() => {
    if (user) {
      const storedActiveButton = localStorage.getItem("activeButtonKey");
      if (storedActiveButton) {
        setActiveButton(storedActiveButton);
      } else {
        setActiveButton("available");
      }
    }
  }, [user]);

  useEffect(() => {
    if (activeButton && user) {
      setListTitleText(
        activeButton === "heart" ? "Your Liked" : "Available Now"
      );
      localStorage.setItem("activeButtonKey", activeButton);
    }
  }, [activeButton, user]);

  useEffect(() => {
    const secondaryCursor = document.querySelector(".secondary-cursor");
    if (secondaryCursor) {
      if (isCursorHidden) {
        secondaryCursor.classList.add("hidden");
      } else {
        secondaryCursor.classList.remove("hidden");
      }
    }
  }, [isCursorHidden]);

  useEffect(() => {
    if (favorites) {
      setIsLiked(
        favorites.map((favorite) => ({
          asset_id: favorite.asset_id,
          isLike: true,
        }))
      );
    }
  }, [favorites]);

  useEffect(() => {
    let newDisplayedList: CloudinaryResource[] = [];

    switch (activeButton) {
      case "heart":
        const likedAssetIds = new Set(isLiked.map((like) => like.asset_id));
        newDisplayedList = trackList.filter(
          (track) => track.asset_id && likedAssetIds.has(track.asset_id)
        );
        break;
      case "available":
        newDisplayedList = trackList;
        break;
    }

    setDisplayedTrackList(newDisplayedList);
  }, [activeButton, trackList, isLiked]);

  const searchedTrackList = useMemo(() => {
    if (searchTerm) {
      return displayedTrackList.filter(
        (track) =>
          track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.producer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return displayedTrackList;
  }, [displayedTrackList, searchTerm]);

  const toggleLike = async () => {
    if (!currentTrack?.assetId) throw new Error("asset id is required");
    if (!user) throw new Error("need login");

    const currentTrackLikeInfo = isLiked.find(
      (item) => item.asset_id === currentTrack?.assetId
    );
    const currentIsLikedState = !!currentTrackLikeInfo;
    await handleOnLike(
      currentTrack?.assetId,
      user.id.toString(),
      currentIsLikedState,
      setIsLiked
    );

    if (!currentIsLikedState) {
      setAnimateLikeForAssetId(currentTrack?.assetId);
    }
  };

  const {
    localVolume,
    showVolumeSlider,
    handleVolumeChange,
    handleVolumeChangeEnd,
    handleVolumeMouseEnter,
    handleVolumeMouseLeave,
  } = useVolumeControl(volume, setVolume, setLiveVolume, isMuted, toggleMute);

  const isLoading =
    isLoadingCloudinary || (activeButton === "heart" && isLoadingFavorites);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    isMuted,
    analyserNode,
    togglePlayPause,
    nextTrack,
    prevTrack,
    handleSelectTrack,
    user,
    trackList: searchedTrackList,
    isLoading,
    isLiked,
    toggleLike,
    animateLikeForAssetId,
    setAnimateLikeForAssetId,
    activeButton,
    setActiveButton,
    listTitleText,
    searchTerm,
    setSearchTerm,
    localVolume,
    showVolumeSlider,
    handleVolumeChange,
    handleVolumeChangeEnd,
    handleVolumeMouseEnter,
    handleVolumeMouseLeave,
    toggleMute,
  };
};
