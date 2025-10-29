"use client";
import React, { useEffect, useState, useMemo, use } from "react";
import { useInView } from "react-intersection-observer";
import Loading from "./loading";
import Error from "./error";
import { GalleryPhotoDetailModal } from "@/components/gallery/GalleryPhotoDetailModal";
import GalleryItems from "@/components/gallery/GalleryItems";
import GalleryFilter from "@/components/gallery/GalleryFilter";
import GalleryModalCreate from "@/components/gallery/GalleryModalCreate";
import useAlbums from "@/components/gallery/hooks/useAlbums";
import usePhotos from "@/components/gallery/hooks/usePhotos";
import { useCreatePhoto } from "@/components/gallery/hooks";
import { useGalleryState } from "@/hooks/useGalleryState";
import { ThemeToggle } from "@/components/theme-toggle";

const Gallery = () => {
  const { ref, inView } = useInView();
  const {
    selectedPhotoData,
    setSelectedPhotoData,
    modalOpen,
    setModalOpen,
    modalCreatePhotoOpen,
    setModalCreatePhotoOpen,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    selectedAlbum,
    setSelectedAlbum,
    previewUrl,
    setPreviewUrl,
    isSubmitting,
    setIsSubmitting,
  } = useGalleryState();
  const { data: albumsData } = useAlbums();
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
  const {
    mutateAsync: createPhotos,
    isPending: isLoadingCreatePhotos,
    isSuccess: createPhotoSuccess,
  } = useCreatePhoto();
  const onSubmit = async (values: Omit<IPhoto, "id">) => {
    await createPhotos({
      title: values.title,
      url: values.url,
      thumbnailUrl: values.url,
      albumId: values.albumId || 1,
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
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 tracking-tight text-slate-900 dark:text-white">
                Khám Phá Thư Viện Ảnh
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl">
                Tìm kiếm, khám phá và chia sẻ những bức ảnh tuyệt đẹp từ cộng
                đồng của chúng tôi
              </p>
            </div>
            <div className="flex gap-2 sm:ml-4">
              <ThemeToggle />
              <GalleryModalCreate
                albums={albumsData}
                open={modalCreatePhotoOpen}
                onOpenChange={setModalCreatePhotoOpen}
                onSubmit={onSubmit}
                setPreviewUrl={setPreviewUrl}
                previewUrl={previewUrl}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
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
          albums={albumsData}
        />

        <GalleryPhotoDetailModal
          photoData={selectedPhotoData}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    </div>
  );
};

export default Gallery;
