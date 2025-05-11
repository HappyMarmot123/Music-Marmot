import { RefObject, MouseEvent } from "react";

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

export interface PagingObject<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface SearchResponse {
  tracks: PagingObject<TrackObjectFull>;
  // Include other types like albums, artists if needed
}

export interface SpotifyTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface ExternalUrls {
  spotify: string;
}

export interface ImageObject {
  url: string;
  height: number | null;
  width: number | null;
}

export interface ArtistObjectSimplified {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface AlbumObjectSimplified {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  type: "album";
  uri: string;
  artists: ArtistObjectSimplified[];
}

export interface TrackObjectFull {
  album: AlbumObjectSimplified;
  artists: ArtistObjectSimplified[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc?: string; ean?: string; upc?: string };
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable?: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface AlbumTrackItem {
  artists: ArtistObjectSimplified[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  name: string;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface AlbumTracks {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: AlbumTrackItem[];
}

export interface Copyright {
  text: string;
  type: string;
}

export interface PlayerTrackDetailsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentProgress: number;
  seekBarContainerRef: RefObject<HTMLDivElement | null>;
  handleSeek: (event: MouseEvent<HTMLDivElement>) => void;
  handleSeekMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
  handleSeekMouseOut: () => void;
  seekHoverTime: number | null;
  seekHoverPosition: number;
}
export interface AlbumArtworkProps {
  isPlaying: boolean;
  isBuffering: boolean;
  currentTrackInfo: TrackInfo | null;
}

export interface PlayerControlsSectionProps {
  currentTrackInfo: TrackInfo | null;
  prevTrack: () => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  isPlaying: boolean;
}

export interface TrackInfo {
  album: string;
  name: string;
  artworkId: string | null;
  url: string;
  producer: string | null;
}

export interface CloudinaryResource {
  id: string;
  created_at: string;
  status: string;
  public_id: string;
  type: string;
  resource_type: string;
  asset_folder: string;
  secure_url: string;
  context: {
    alt: string;
    caption: string;
  };
  // 가공된 추가 필드
  title: string | null;
  producer: string | null;
  album_secure_url: string | null;
}
