"use client";
import ModalCreate from "@/components/gallery/ModalCreate";
import { PhotoDetailModal } from "@/components/gallery/PhotoDetailModal";
import FilterGallery from "@/components/gallery/Filter";
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
import Items from "@/components/gallery/Items";
import { Filter } from "lucide-react";

function Gallery() {
  const { ref, inView } = useInView();
  const [title, setTitle] = useState("");
  const [selectedPhotoData, setSelectedPhotoData] = useState<IPhoto | null>(
    null
  );
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCreatePhotoOpen, setModalCreatePhotoOpen] = useState(false);
  const [localPhotos, setLocalPhotos] = useState<IPhoto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const stored = localStorage.getItem("customPhotos");
    if (stored) {
      try {
        setLocalPhotos(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored photos:", e);
      }
    }
  }, []);

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
    const handleNewPhotoAdded = (event: any) => {
      const newPhoto = event.detail;
      setLocalPhotos((prev) => [newPhoto, ...prev]);

      const stored = localStorage.getItem("customPhotos");
      const photos = stored ? JSON.parse(stored) : [];
      localStorage.setItem(
        "customPhotos",
        JSON.stringify([newPhoto, ...photos])
      );
    };

    window.addEventListener("photoAdded", handleNewPhotoAdded);
    return () => window.removeEventListener("photoAdded", handleNewPhotoAdded);
  }, []);

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
        <ModalCreate
          albums={albums}
          open={modalCreatePhotoOpen}
          onOpenChange={setModalCreatePhotoOpen}
        />
      </div>
      <FilterGallery
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {status === "pending" && <Loading />}

      {error && <Error error={error} />}

      <Items
        localPhotos={localPhotos}
        data={data}
        handlePhotoClick={handlePhotoClick}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        ref={ref}
      />

      <PhotoDetailModal
        photoData={selectedPhotoData}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

export default Gallery;
