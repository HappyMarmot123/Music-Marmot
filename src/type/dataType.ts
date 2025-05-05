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
