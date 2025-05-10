import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// TODO: 체이닝메소드 공식문서
// https://cloudinary.com/documentation/search_method

cloudinary.config({
  cloud_name: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression("resource_type:video AND context.category=EDM")
      .max_results(20)
      .fields("asset_id")
      .fields("filename")
      .fields("format")
      .fields("resource_type")
      .fields("created_at")
      .fields("last_updated")
      .sort_by("created_at", "desc")
      .execute();

    return NextResponse.json(result.resources);
  } catch (error) {
    console.error("Cloudinary 이미지 가져오기 실패 (API Route):", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
