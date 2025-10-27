export interface Image {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  likes?: number;
}

export interface Gallery {
  images: Image[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
}

export interface CreateImagePayload {
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  tags?: string[];
}
