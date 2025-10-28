"use client";
import ModalCreate from "@/components/gallery/ModalCreate";
import { PhotoDetailModal } from "@/components/gallery/PhotoDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IPhoto } from "@/types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { set } from "zod";

function Todos() {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const [title, setTitle] = useState("");
  const [selectedPhotoData, setSelectedPhotoData] = useState<IPhoto | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAllPhotos = async ({ pageParam = 1 }: { pageParam: number }) => {
    const res = await axios.get(`/api/photos?_page=${pageParam}`);
    return res.data;
  };

  const fetchAllAlbums = async () => {
    const res = await axios.get(`/api/albums`);
    console.log("res :>> ", res.data);
    return res.data;
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
    queryKey: ["photos"],
    queryFn: fetchAllPhotos,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
  });
  const mutation = useMutation({
    mutationFn: (newTodo: IPhoto) =>
      axios.post("https://jsonplaceholder.typicode.com/photos", newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
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

  const handlePhotoClick = (photo: IPhoto) => {
    setSelectedPhotoData(photo);
    setModalOpen(true);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    fetchAllAlbums();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        🖼️ Photo Gallery - Infinite Scroll
      </h1>

      <ModalCreate />

      {/* Loading state */}
      {status === "pending" && (
        <p className="text-center py-8">⏳ Đang tải ảnh...</p>
      )}

      {/* Error state */}
      {error && (
        <p className="text-red-500 text-center py-8">
          ❌ Error: {error.message}
        </p>
      )}

      <ul className="grid grid-cols-5 gap-4">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((photo: IPhoto) => (
              <li
                key={photo.id}
                className="border rounded p-3 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePhotoClick(photo)}
              >
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-48 object-cover rounded mb-2 hover:opacity-80 transition-opacity"
                />
                <p className="text-sm font-medium line-clamp-2">
                  {photo.title}
                </p>
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>

      <div ref={ref} className="text-center mt-8 py-8">
        {isFetchingNextPage ? (
          <p className="text-lg">⏳ Đang tải thêm ảnh...</p>
        ) : hasNextPage ? (
          <p className="text-gray-500">👇 Scroll để tải thêm ảnh</p>
        ) : (
          <p className="text-green-600">✅ Đã tải hết tất cả ảnh!</p>
        )}
      </div>

      {/* Photo detail modal */}
      <PhotoDetailModal
        photoData={selectedPhotoData}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

export default Todos;
