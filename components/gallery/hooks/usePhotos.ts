import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllPhotos } from "@/lib/fetchers";

interface UsePhotosParams {
  searchTerm?: string;
  sortBy?: string;
  albumId?: number | null;
}

export const usePhotos = ({
  searchTerm = "",
  sortBy = "newest",
  albumId = null,
}: UsePhotosParams = {}) => {
  return useInfiniteQuery({
    queryKey: ["photos", searchTerm, sortBy, albumId],
    queryFn: ({ pageParam }) =>
      fetchAllPhotos(pageParam, searchTerm, sortBy, albumId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
  });
};

export default usePhotos;
