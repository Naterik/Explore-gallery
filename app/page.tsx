"use client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import Loading from "./loading";
import Error from "./error";
import Items from "@/components/gallery/GalleryItems";
import { Filter } from "lucide-react";
import { GalleryPhotoDetailModal } from "@/components/gallery/GalleryPhotoDetailModal";
import GalleryItems from "@/components/gallery/GalleryItems";
import GalleryFilter from "@/components/gallery/GalleryFilter";
import GalleryModalCreate from "@/components/gallery/GalleryModalCreate";

const Gallery = () => {
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [selectedPhotoData, setSelectedPhotoData] = useState<IPhoto | null>(
    null
  );
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCreatePhotoOpen, setModalCreatePhotoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchAllPhotos = async ({ pageParam = 1 }: { pageParam: number }) => {
    const params = new URLSearchParams({
      _page: pageParam.toString(),
      search: searchTerm,
      sort: sortBy,
    });
    const res = await axios.get(`/api/photos?${params.toString()}`);
    return res.data;
  };

  const fetchAllAlbums = async () => {
    const res = await axios.get(`/api/albums`);
    setAlbums(res.data.data);
    return res.data;
  };

  // Mutation để thêm ảnh mới
  const addPhotoMutation = useMutation({
    mutationFn: async (newPhoto: any) => {
      const res = await axios.post("/api/photos", newPhoto);
      return res.data;
    },
    onSuccess: () => {
      // Refetch photos sau khi thêm thành công
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
    onError: (error) => {
      console.error("Error adding photo:", error);
    },
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["photos", searchTerm, sortBy],
    queryFn: fetchAllPhotos,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
  });

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          🖼️ Photo Gallery - Infinite Scroll
        </h1>
        <GalleryModalCreate
          albums={albums}
          open={modalCreatePhotoOpen}
          onOpenChange={setModalCreatePhotoOpen}
        />
      </div>
      <GalleryFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {status === "pending" && <Loading />}

      {error && <Error error={error} />}

      <GalleryItems
        data={data}
        handlePhotoClick={handlePhotoClick}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        ref={ref}
      />

      <GalleryPhotoDetailModal
        photoData={selectedPhotoData}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Gallery;
