"use client";
import ModalCreate from "@/components/gallery/ModalCreate";
import { PhotoDetailModal } from "@/components/gallery/PhotoDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function Todos() {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const [title, setTitle] = useState("");
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getAllPhotos = async ({ pageParam = 1 }) => {
    const start = (pageParam - 1) * 9;
    const end = start + 9;
    const res = await axios.get("/api/photos");
    return res.data.slice(start, end);
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: getAllPhotos,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 9) {
        return lastPageParam + 1;
      }
      return undefined;
    },
  });

  const mutation = useMutation({
    mutationFn: (newTodo: any) =>
      axios.post("https://jsonplaceholder.typicode.com/photos", newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setTitle("");
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      id: Date.now().toString(),
      title: title,
      url: "https://via.placeholder.com/600/92c952",
      thumbnailUrl: "https://via.placeholder.com/150/92c952",
    });
  };

  const handlePhotoClick = (photoId: string) => {
    setSelectedPhotoId(photoId);
    setModalOpen(true);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Photo Gallery</h1>

      <ModalCreate />

      {/* Danh sách */}
      {error && <p>Error: {error.message}</p>}
      <ul className="grid grid-cols-3 gap-4">
        {data?.pages.map((d) =>
          d.map((page: any) => (
            <li
              key={page.id}
              className="border rounded p-3 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handlePhotoClick(page.id.toString())}
            >
              <img
                src={page.thumbnailUrl}
                alt={page.title}
                className="w-full h-48 object-cover rounded mb-2 hover:opacity-80 transition-opacity"
              />
              <p className="text-sm font-medium">{page.title}</p>
            </li>
          ))
        )}
      </ul>

      <div ref={ref} className="text-center mt-8">
        {isFetchingNextPage
          ? "⏳ Đang tải..."
          : hasNextPage
          ? "👇 Scroll để tải thêm"
          : "✅ Đã tải hết"}
      </div>

      {/* Modal hiển thị chi tiết ảnh */}
      <PhotoDetailModal
        photoId={selectedPhotoId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

export default Todos;
