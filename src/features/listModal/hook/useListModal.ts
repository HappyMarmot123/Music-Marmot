import { useEffect, useMemo, useState, useCallback } from "react";
import { useAudioPlayer } from "@/app/providers/audioPlayerProvider";
import { useAuth } from "@/app/providers/authProvider";
import { CloudinaryResourceMap } from "@/shared/types/dataType";
import useCloudinaryStore from "@/app/store/cloudinaryStore";
import { useFavorites } from "@/features/listModal/hook/useFavorites";
import { useVolumeControl } from "@/features/player/hook/useVolumeControl";
import { toast } from "sonner";
import favoriteStore from "@/app/store/favoriteStore";

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
  const { data: initialFavorites, isLoading: isLoadingFavorites } =
    useFavorites();
  const {
    favoriteAssetIds,
    setFavorites,
    toggleFavorite: storeToggleFavorite,
  } = favoriteStore();

  const [isCursorHidden] = useState(true);
  const [activeButton, setActiveButton] = useState("available");
  const [listTitleText, setListTitleText] = useState("Available Now");
  const [searchTerm, setSearchTerm] = useState("");

  const [allTracks, setAllTracks] = useState<CloudinaryResourceMap>(new Map());
  const [displayedTrackList, setDisplayedTrackList] =
    useState<CloudinaryResourceMap>(new Map());

  const isLoading = isLoadingCloudinary || isLoadingFavorites;

  useEffect(() => {
    if (initialFavorites) {
      setFavorites(initialFavorites);
    }
  }, [initialFavorites, setFavorites]);

  useEffect(() => {
    if (cloudinaryData) {
      setAllTracks(cloudinaryData);
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
        newDisplayedList = allTracks;
        break;
    }

    console.log("🚀 ~ useEffect ~ newDisplayedList:", newDisplayedList);
    setDisplayedTrackList(newDisplayedList);
  }, [activeButton, allTracks, favoriteAssetIds, cloudinaryData]);

  const trackList = useMemo(() => {
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
    console.log("🚀 ~ trackList ~ filteredEntries:", filteredEntries);
    return new Map(filteredEntries);
  }, [displayedTrackList, searchTerm]);

  const toggleFavorite = useCallback(
    (assetId: string) => {
      if (!user) {
        toast.error("You need to login to like tracks.");
        return;
      }
      storeToggleFavorite(assetId, user.id);
    },
    [user, storeToggleFavorite]
  );

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
    allTracks,
    trackList,
    isLoading,
    favoriteAssetIds,
    toggleFavorite,
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
