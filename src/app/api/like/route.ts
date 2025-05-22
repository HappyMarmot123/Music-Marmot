import { NextResponse } from "next/server";
import { addFavorite, removeFavorite } from "@/db/favoritesQuery";
import { supabase } from "@/api/supabaseClient";
import { getFavoritesByUserId } from "@/db/favoritesQuery";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/* 
  TODO:
  Next.js App Router 환경의 Route Handler에서는 
  @supabase/auth-helpers-nextjs의 createRouteHandlerClient를 사용하여 
  쿠키와 함께 Supabase 클라이언트를 생성해야 세션 정보에 접근된다.
*/
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

export async function GET() {
  // const supabase = createRouteHandlerClient({ cookies });
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const favorites = await getFavoritesByUserId(userId);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites in API route:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
