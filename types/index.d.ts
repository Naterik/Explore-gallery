export interface IPhoto {
  albumId?: string;
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
}

export interface Gallery {
  photos: IPhoto[];
  total: number;
  page: number;
  pageSize: number;
}
