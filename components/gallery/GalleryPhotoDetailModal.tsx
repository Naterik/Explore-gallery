"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PhotoDetailModalProps {
  photoData: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GalleryPhotoDetailModal({
  photoData,
  open,
  onOpenChange,
}: PhotoDetailModalProps) {
  // ✅ Kiểm tra xem URL có phải Base64 không
  const isBase64 = photoData?.url?.startsWith("data:image");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{photoData?.title || "Loading..."}</DialogTitle>
        </DialogHeader>
        {photoData ? (
          <div className="space-y-4">
            <img
              src={photoData.url || photoData.thumbnailUrl}
              alt={photoData.title}
              className="w-full h-96 object-cover rounded-lg"
            />

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">ID</p>
                <p className="font-semibold">{photoData.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Tiêu đề</p>
                <p className="font-semibold">{photoData.title}</p>
              </div>
              <div>
                <p className="text-gray-600">Album ID</p>
                <p className="font-semibold">{photoData.albumId}</p>
              </div>

              {!isBase64 && (
                <div>
                  <p className="text-gray-600">URL Ảnh</p>
                  <p className="font-mono text-xs break-all text-blue-600">
                    {photoData.url}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">❌ Không tìm thấy ảnh</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
