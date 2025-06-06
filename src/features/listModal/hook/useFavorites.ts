import { useQuery } from "@tanstack/react-query";
import { favorites } from "@/entities/ToggleFavorite/favoriteSchema";
import { useAuth } from "@/app/providers/authProvider";

type Favorite = typeof favorites.$inferSelect;

const fetchFavorites = async (): Promise<Favorite[]> => {
  const response = await fetch("/api/supabase");
  if (!response.ok)
    throw new Error("Network response was not ok fetching favorites");

  return response.json();
};

export const useFavorites = () => {
  const { user } = useAuth();
  return useQuery<Favorite[], Error>({
    queryKey: ["favorites", user?.id],
    enabled: !!user,
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 60, // 1시간
  });
};
