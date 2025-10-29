export {};

declare global {
  interface IPhoto {
    id: number;
    albumId: number;
    title: string;
    url: string;
    thumbnailUrl?: string;
    createdAt?: string;
  }

  interface IAlbums {
    userId: number;
    id: number;
    title: string;
  }

  interface IGallery {
    data: IPhoto[];
    nextCursor: number | null;
    totalCount?: number;
  }
}
