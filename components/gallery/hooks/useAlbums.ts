import { fetchAllAlbums } from "@/lib/fetchers";
import { useQuery } from "@tanstack/react-query";

export default function useAlbums() {
  return useQuery({ queryKey: ["albums"], queryFn: fetchAllAlbums });
}
