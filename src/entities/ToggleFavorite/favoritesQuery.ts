import { db } from "@/shared/db/dbConnection";
import { favorites } from "@/entities/ToggleFavorite/favoriteSchema";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

export const getFavoritesByUserId = cache(
  async (userId: string): Promise<Array<typeof favorites.$inferSelect>> => {
    try {
      const userFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.user_id, userId));
      return userFavorites;
    } catch (error) {
      console.error("Error selecting favorites by user ID:", error);
      throw new Error("Failed to select favorites.");
    }
  }
);

export const addFavorite = cache(
  async (userId: string, assetId: string): Promise<void> => {
    try {
      await db
        .insert(favorites)
        .values({ user_id: userId, asset_id: assetId })
        .onConflictDoNothing(); // (userId, assetId) 충돌 시 무시
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw new Error("Failed to add favorite.");
    }
  }
);

export const removeFavorite = cache(
  async (userId: string, assetId: string): Promise<void> => {
    try {
      await db
        .delete(favorites)
        .where(
          and(eq(favorites.user_id, userId), eq(favorites.asset_id, assetId))
        );
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw new Error("Failed to remove favorite.");
    }
  }
);
