import Loading from "@/app/loading";
import { formatDateTime } from "@/lib/utils";
import React from "react";

type IProps = {
  data: any;
  handlePhotoClick: (photo: IPhoto) => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  ref: any;
  albums?: IAlbums[];
};

const GalleryItems = ({
  data,
  handlePhotoClick,
  isFetchingNextPage,
  hasNextPage,
  ref,
  albums,
}: IProps) => {
  const totalPhotos =
    data?.pages?.reduce(
      (sum: number, page: IGallery) => sum + (page.data?.length || 0),
      0
    ) || 0;
  const isEmpty = totalPhotos === 0;

  const getAlbumTitle = (albumId: number) => {
    return (
      albums?.find((album) => album.id === albumId)?.title || `Album ${albumId}`
    );
  };

  return (
    <>
      {isEmpty ? (
        <div className="text-center py-24">
          <div className="mb-4 text-6xl animate-bounce">📸</div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            Không có ảnh nào
          </p>
          <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            Không tìm thấy ảnh nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi
            tiêu chí tìm kiếm hoặc thêm ảnh mới.
          </p>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8">
            {data?.pages.map((page: IGallery, pageIndex: number) => (
              <React.Fragment key={pageIndex}>
                {page.data.map((photo: IPhoto) => (
                  <li
                    key={photo.id}
                    className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1"
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <div className="relative overflow-hidden h-48 sm:h-52 lg:h-56 bg-slate-200 dark:bg-slate-700">
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {photo.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <span className="text-xs">
                          📅 {formatDateTime(photo.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                          {getAlbumTitle(photo.albumId)}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
          <div ref={ref} className="py-12 text-center">
            {isFetchingNextPage ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Đang tải...
                </p>
              </div>
            ) : hasNextPage ? (
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  👇 Tiếp tục cuộn để tải thêm
                </p>
                <div className="flex justify-center">
                  <div className="text-2xl animate-bounce">⬇️</div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                  ✨ Bạn đã xem hết tất cả ảnh
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Quay lại trên cùng hoặc thay đổi bộ lọc để khám phá thêm
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default GalleryItems;
