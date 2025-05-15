import { CloudinaryResource } from "@/type/dataType";
import Image from "next/image";

export default function ModalMusicList({
  isLoadingCloudinary,
  trackList,
}: {
  isLoadingCloudinary: boolean;
  trackList: CloudinaryResource[];
}) {
  return (
    <>
      {isLoadingCloudinary && (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center p-3 rounded-lg bg-white/5"
            >
              <div className="w-12 h-12 rounded-md mr-4 bg-white/10"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-white/10 rounded"></div>
              </div>
              <div className="w-16 h-3 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      )}
      {trackList.length > 0 &&
        trackList.map((track) => (
          <div
            key={track.id}
            className="flex items-center p-3 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <Image
              src={track.album_secure_url as string}
              alt={track.title as string}
              width={48}
              height={48}
              className="rounded-md mr-4"
            />

            <div className="flex-1">
              <h3 className="font-medium">{track.title}</h3>
              <p className="text-sm text-gray-400">{track.title}</p>
            </div>

            <div className="text-gray-400 text-sm">{track.producer}</div>
          </div>
        ))}
      {trackList.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
        </div>
      )}
    </>
  );
}
