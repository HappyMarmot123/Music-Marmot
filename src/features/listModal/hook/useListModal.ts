import { useEffect, useMemo, useState } from "react";
import { useAudioPlayer } from "@/app/providers/audioPlayerProvider";
import { useAuth } from "@/app/providers/authProvider";
import { CloudinaryResource } from "@/shared/types/dataType";
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
  const [favoriteAssetIds, setFavoriteAssetIds] = useState<Set<string>>(
    favorites || new Set([])
  );

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
        activeButton === "heart" ? "Your Favorites" : "Available Now"
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
    let newDisplayedList: CloudinaryResource[] = [];

    switch (activeButton) {
      case "heart":
        const assetIds = Array.from(favoriteAssetIds);
        newDisplayedList = trackList.filter(
          (track) => track.asset_id && assetIds.includes(track.asset_id)
        );
        break;
      case "available":
        newDisplayedList = trackList;
        break;
    }

    setDisplayedTrackList(newDisplayedList);
  }, [activeButton, trackList, favoriteAssetIds]);

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

  const toggleFavorite = async () => {
    if (!currentTrack) throw new Error("asset id is required");
    if (!user) throw new Error("need login");

    const currentTrackFavorite = [...favoriteAssetIds].find(
      (item) => item === currentTrack?.assetId
    );
    const currentFavoriteState = !!currentTrackFavorite;
    await handleOnLike(
      currentTrack?.assetId,
      user.id.toString(),
      currentFavoriteState,
      setFavoriteAssetIds
    );

    if (!currentFavoriteState) {
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
    favoriteAssetIds,
    toggleFavorite,
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
