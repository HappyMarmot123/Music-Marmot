import { useQuery } from "@tanstack/react-query";
import { favorites } from "@/entities/ToggleFavorite/favoriteSchema";
import { useAuth } from "@/app/providers/authProvider";
import axios, { AxiosResponse } from "axios";

export type Favorite = typeof favorites.$inferSelect;

const fetchFavorites = async (): Promise<Set<string>> => {
  const response: AxiosResponse<Favorite[]> = await axios.get("/api/supabase");

  if (response.status !== 200) {
    throw new Error("Network response was not ok fetching favorites");
  }

  const newSetResponse = new Set(
    response.data.map((favorite) => favorite.asset_id)
  );
  return newSetResponse;
};

export const useFavorites = () => {
  const { user } = useAuth();
  return useQuery<Set<string>, Error>({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 60, // 1시간
  });
};
