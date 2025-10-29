import Loading from "@/app/loading";
import React from "react";

type IProps = {
  data: any;
  handlePhotoClick: (photo: IPhoto) => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  ref: any;
};

const GalleryItems = ({
  data,
  handlePhotoClick,
  isFetchingNextPage,
  hasNextPage,
  ref,
}: IProps) => {
  // Tính tổng số photos đã tải
  const totalPhotos =
    data?.pages?.reduce(
      (sum: number, page: IGallery) => sum + (page.data?.length || 0),
      0
    ) || 0;

  // Kiểm tra nếu không có dữ liệu
  const isEmpty = totalPhotos === 0;

  return (
    <>
      {isEmpty ? (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-400 mb-2">📸 Không có ảnh</p>
          <p className="text-gray-500">
            Không tìm thấy ảnh nào. Hãy thử thay đổi bộ lọc hoặc tìm kiếm.
          </p>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-5 gap-4">
            {data?.pages.map((page: IGallery, pageIndex: number) => (
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
              <Loading />
            ) : hasNextPage ? (
              <p className="text-gray-500">👇 Scroll để tải thêm ảnh</p>
            ) : (
              <p className="text-gray-400">✅ Bạn đã xem hết tất cả ảnh</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default GalleryItems;
