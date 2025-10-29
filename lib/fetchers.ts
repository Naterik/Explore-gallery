import axios from "axios";

const fetchAllPhotos = async (
  pageParam: number,
  searchTerm: string = "",
  sortBy: string = "newest",
  albumId: number | null = null
): Promise<IGallery> => {
  const queryString = new URLSearchParams();
  queryString.append("_page", String(pageParam));
  if (searchTerm) queryString.append("search", searchTerm);
  if (sortBy) queryString.append("sort", sortBy);
  if (albumId !== null && albumId > 0)
    queryString.append("albumId", String(albumId));

  const res = await axios.get(`/api/photos?${queryString.toString()}`);
  return res.data;
};

const fetchAllAlbums = async (): Promise<IAlbums[]> => {
  const res = await axios.get(`/api/albums`);
  return res.data.data;
};

const fetchCreatePhoto = async (newPhoto: Omit<IPhoto, "id">) => {
  const res = await axios.post("/api/photos", {
    title: newPhoto.title,
    url: newPhoto.url,
    thumbnailUrl: newPhoto.thumbnailUrl,
    albumId: newPhoto.albumId,
  });
  return res.data;
};

export { fetchAllPhotos, fetchAllAlbums, fetchCreatePhoto };
