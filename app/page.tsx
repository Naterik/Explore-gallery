"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import Loading from "./loading";
import Error from "./error";
import { GalleryPhotoDetailModal } from "@/components/gallery/GalleryPhotoDetailModal";
import GalleryItems from "@/components/gallery/GalleryItems";
import GalleryFilter from "@/components/gallery/GalleryFilter";
import GalleryModalCreate from "@/components/gallery/GalleryModalCreate";
import useAlbums from "@/hooks/useAlbums";
import usePhotos from "@/hooks/usePhotos";

const Gallery = () => {
  const { ref, inView } = useInView();
  const [selectedPhotoData, setSelectedPhotoData] = useState<IPhoto | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCreatePhotoOpen, setModalCreatePhotoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);

  const {
    data: albumsData,
    isPending: isLoadingAlbums,
    error: errorAlbums,
  } = useAlbums();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = usePhotos({
    searchTerm,
    sortBy,
    albumId: selectedAlbum,
  });

  const handlePhotoClick = (photo: IPhoto) => {
    setSelectedPhotoData(photo);
    setModalOpen(true);
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          🖼️ Photo Gallery - Infinite Scroll
        </h1>
        <GalleryModalCreate
          albums={albumsData}
          open={modalCreatePhotoOpen}
          onOpenChange={setModalCreatePhotoOpen}
        />
      </div>
      <GalleryFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        albums={albumsData}
        selectedAlbum={selectedAlbum}
        setSelectedAlbum={setSelectedAlbum}
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
