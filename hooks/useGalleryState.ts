import { useState } from "react";

export const useGalleryState = () => {
  const [selectedPhotoData, setSelectedPhotoData] = useState<IPhoto | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCreatePhotoOpen, setModalCreatePhotoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return {
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
  };
};
