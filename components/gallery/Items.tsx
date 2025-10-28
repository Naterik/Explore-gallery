import Loading from "@/app/loading";
import React from "react";

type IProps = {
  localPhotos: IPhoto[];
  data: any;
  handlePhotoClick: (photo: IPhoto) => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  ref: any;
};

const Items = ({
  localPhotos,
  data,
  handlePhotoClick,
  isFetchingNextPage,
  hasNextPage,
  ref,
}: IProps) => {
  return (
    <>
      <ul className="grid grid-cols-5 gap-4">
        {localPhotos.map((photo: IPhoto) => (
          <li
            key={photo.id}
            className="border rounded p-3 cursor-pointer hover:shadow-lg transition-shadow bg-yellow-50"
            onClick={() => handlePhotoClick(photo)}
          >
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              className="w-full h-48 object-cover rounded mb-2 hover:opacity-80 transition-opacity"
            />
            <p className="text-sm font-medium line-clamp-2">{photo.title}</p>
            <span className="text-xs text-blue-600 font-semibold">✨ Mới</span>
          </li>
        ))}

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
          <Loading />
        )}
      </div>
    </>
  );
};

export default Items;
