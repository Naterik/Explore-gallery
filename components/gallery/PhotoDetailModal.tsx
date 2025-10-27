"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PhotoDetailModalProps {
  photoId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoDetailModal({
  photoId,
  open,
  onOpenChange,
}: PhotoDetailModalProps) {
  const { data: photo, isLoading } = useQuery({
    queryKey: ["photo", photoId],
    queryFn: () => axios.get(`/api/photos/${photoId}`).then((res) => res.data),
    enabled: !!photoId && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{photo?.title || "Loading..."}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-8">⏳ Đang tải...</div>
        ) : photo ? (
          <div className="space-y-4">
            {/* Ảnh full size */}
            <img
              src={photo.url || photo.thumbnailUrl}
              alt={photo.title}
              className="w-full h-96 object-cover rounded-lg"
            />

            {/* Thông tin ảnh */}
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">ID</p>
                <p className="font-semibold">{photo.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Tiêu đề</p>
                <p className="font-semibold">{photo.title}</p>
              </div>
              <div>
                <p className="text-gray-600">Album ID</p>
                <p className="font-semibold">{photo.albumId}</p>
              </div>
              <div>
                <p className="text-gray-600">URL Ảnh</p>
                <p className="font-mono text-xs break-all text-blue-600">
                  {photo.url}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">❌ Không tìm thấy ảnh</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
