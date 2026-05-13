export interface Track {
  id: string;
  title: string;
  artistName: string;
  coverImageUrl?: string | null;
  duration: number;
  locationName: string;
  streamUrl?: string | null;
}

export interface Album {
  id: string;
  title: string;
  artistName: string;
  coverImageUrl?: string | null;
  createdAt?: string;
  trackCount?: number;
}

export interface AlbumDetail extends Album {
  tracks: TrackWithStreaming[];
}

export interface TrackWithStreaming extends Track {
  streamUrl: string;
}
