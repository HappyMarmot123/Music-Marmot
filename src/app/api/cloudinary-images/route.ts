import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

/*
TODO: 체이닝메소드 공식문서
https://cloudinary.com/documentation/search_method

csr에 임포트된 ssr에서 서버함수를 호출하면 cloudinary 관련 코드가 
클라이언트 번들에 포함되려 하면서 fs모듈 에러가 발생함
서버 측에서 실행되어야 하는 로직은 Next.js의 API 라우트 핸들러로 옮겨야 한다
*/

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
