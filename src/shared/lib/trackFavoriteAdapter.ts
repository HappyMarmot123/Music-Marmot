import { TrackInfo, CloudinaryResource, UnifiedTrack } from "../types/dataType";

/* TODO: 
    중재자 패턴 추가
*/

export class TrackFavoriteAdapter {
  static unifyTrack(track: TrackInfo | CloudinaryResource): UnifiedTrack {
    if (this.isCloudinaryResource(track)) {
      return {
        id: track.asset_id,
        name: track.title,
        album: track.asset_folder,
        artworkUrl: track.album_secure_url,
        producer: track.producer,
        url: track.secure_url,
        metadata: {
          createdAt: track.created_at,
          status: track.status,
          publicId: track.public_id,
          type: track.type,
          resourceType: track.resource_type,
          context: track.context,
        },
      };
    }

    if (this.isTrackInfo(track)) {
      return {
        id: track.assetId,
        name: track.name,
        album: track.album,
        artworkUrl: track.artworkId ?? "",
        producer: track.producer,
        url: track.url,
        metadata: {},
      };
    }

    throw new Error("Invalid track data: unrecognized track type");
  }

  private static isCloudinaryResource(
    track: TrackInfo | CloudinaryResource
  ): track is CloudinaryResource {
    return "asset_id" in track && typeof track.asset_id === "string";
  }

  private static isTrackInfo(
    track: TrackInfo | CloudinaryResource
  ): track is TrackInfo {
    return "assetId" in track && typeof track.assetId === "string";
  }
}
