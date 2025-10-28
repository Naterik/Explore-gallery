export {};

declare global {
  export interface IPhoto {
    albumId?: string;
    id: string;
    title: string;
    url: string;
    thumbnailUrl?: string;
  }

  export interface IAlbum {
    userId: string;
    id: string;
    title: string;
  }
  export interface IGallery {
    data: IPhoto[];
    nextCursor: number;
  }
}
