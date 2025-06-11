import { useEffect, useMemo, useState } from "react";
import { useAudioPlayer } from "@/app/providers/audioPlayerProvider";
import { useAuth } from "@/app/providers/authProvider";
import { CloudinaryResourceMap } from "@/shared/types/dataType";
import useCloudinaryStore from "@/app/store/cloudinaryStore";
import { useFavorites } from "@/features/listModal/hook/useFavorites";
import { useVolumeControl } from "@/features/player/hook/useVolumeControl";
import { handleOnLike } from "@/shared/lib/util";

export const useListModal = () => {
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

  const cloudinaryData = useCloudinaryStore((state) => state.cloudinaryData);
  const isLoadingCloudinary = useCloudinaryStore(
    (state) => state.isLoadingCloudinary
  );

  const { user } = useAuth();
  const { data: favorites, isLoading: isLoadingFavorites } = useFavorites();

  const [isCursorHidden] = useState(true);
  const [activeButton, setActiveButton] = useState("available");
  const [listTitleText, setListTitleText] = useState("Available Now");
  const [searchTerm, setSearchTerm] = useState("");

  const [trackList, setTrackList] = useState<CloudinaryResourceMap>(new Map());
  const [displayedTrackList, setDisplayedTrackList] =
    useState<CloudinaryResourceMap>(new Map());
  const [animateLikeForAssetId, setAnimateLikeForAssetId] = useState<
    string | null
  >(null);
  const [favoriteAssetIds, setFavoriteAssetIds] = useState<Set<string>>(
    favorites || new Set([])
  );

  const isLoading =
    isLoadingCloudinary || (activeButton === "heart" && isLoadingFavorites);

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
    let newDisplayedList: CloudinaryResourceMap = new Map();

    switch (activeButton) {
      case "heart":
        const favoriteTracks: CloudinaryResourceMap = new Map();
        favoriteAssetIds.forEach((assetId) => {
          const track = cloudinaryData.get(assetId);
          if (track) {
            favoriteTracks.set(track.asset_id, track);
          }
        });
        newDisplayedList = favoriteTracks;
        break;
      case "available":
        newDisplayedList = trackList;
        break;
    }

    setDisplayedTrackList(newDisplayedList);
  }, [activeButton, trackList, favoriteAssetIds, cloudinaryData]);

  const searchedTrackList = useMemo((): CloudinaryResourceMap => {
    if (!searchTerm.trim()) return displayedTrackList;

    const searchTermLower = searchTerm.toLowerCase();
    const filteredEntries = Array.from(displayedTrackList.entries()).filter(
      ([_, value]) => {
        const titleMatch = value.title?.toLowerCase().includes(searchTermLower);
        const producerMatch = value.producer
          ?.toLowerCase()
          .includes(searchTermLower);
        return titleMatch || producerMatch;
      }
    );
    return new Map(filteredEntries);
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
