import { NextResponse } from "next/server";
import { addFavorite, removeFavorite } from "@/db/favoritesQuery";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assetId, userId, isLiked } = body;

    if (!assetId || !userId || typeof isLiked !== "boolean") {
      return NextResponse.json(
        { message: "Missing required fields or invalid data type" },
        { status: 400 }
      );
    }

    if (isLiked) {
      await addFavorite(userId, assetId);
      return NextResponse.json({ message: "Favorite added" }, { status: 200 });
    } else {
      await removeFavorite(userId, assetId);
      return NextResponse.json(
        { message: "Favorite removed" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing favorite request in API route:", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
