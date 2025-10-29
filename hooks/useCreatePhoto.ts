import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCreatePhoto } from "@/lib/fetchers";

export const useCreatePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPhoto: IPhoto) => fetchCreatePhoto(newPhoto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["photos"],
      });
    },
  });
};

export default useCreatePhoto;
