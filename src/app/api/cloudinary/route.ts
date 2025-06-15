import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { CloudinaryResource } from "@/shared/types/dataType";
import { replaceKeyName } from "@/shared/lib/util";

/*
TODO: 체이닝메소드 공식문서
https://cloudinary.com/documentation/search_method

csr에 임포트된 ssr에서 서버함수를 호출하면 cloudinary 관련 코드가 
클라이언트 번들에 포함되려 하면서 fs모듈 에러가 발생함
서버 측에서 실행되어야 하는 로직은 Next.js의 API 라우트 핸들러로 옮겨야 한다
*/

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const musicList = await cloudinary.search
      .expression("resource_type:video AND tags:EDM")
      .max_results(50)
      .fields("asset_id")
      .fields("secure_url")
      .fields("context")
      .sort_by("created_at", "desc")
      .execute()
      .then((result) => {
        return result.resources.map(replaceKeyName);
      });

    const albumList = await cloudinary.search
      .expression("resource_type:image AND tags:EDM Cover")
      .max_results(50)
      .fields("asset_id")
      .fields("secure_url")
      .fields("context")
      .execute()
      .then((result) => {
        return result.resources.map(replaceKeyName);
      });

    const matchedMusicList = musicList.map((music: CloudinaryResource) => {
      const matchedAlbum = albumList.find(
        (album: CloudinaryResource) =>
          album.title === music.title && album.producer === music.producer
      );
      return {
        ...music,
        album_secure_url: matchedAlbum?.secure_url || null,
      };
    });

    return NextResponse.json(matchedMusicList);
  } catch (error) {
    console.error("Cloudinary 이미지 가져오기 실패 (API Route):", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
