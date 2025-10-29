import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCreatePhoto } from "@/lib/fetchers";

const useCreatePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPhoto: Omit<IPhoto, "id">) => fetchCreatePhoto(newPhoto),

    onSuccess: () => {
      // ✅ Dùng invalidateQueries để fetch lại từ API
      // - API sẽ return tất cả photos sort "newest" (mới nhất trước)
      // - Ảnh vừa tạo có createdAt hôm nay → sẽ ở đầu
      queryClient.invalidateQueries({
        queryKey: ["photos"],
        exact: false, // Match TẤT CẢ queryKey bắt đầu ["photos"]
      });
    },
  });
};

export default useCreatePhoto;
