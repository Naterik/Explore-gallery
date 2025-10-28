import { REAL_IMAGES } from "@/public/seed";
import axios from "axios";
import { get } from "http";

const apiUrl =
  process.env.API_PHOTOS || "https://jsonplaceholder.typicode.com/photos";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("_page") || "1";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    const limit = "10";

    const res = await axios.get(`${apiUrl}?_limit=5000`);
    let photos = res.data;

    if (search) {
      photos = photos.filter((photo: any) =>
        photo.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sort) {
      case "title-asc":
        photos.sort((a: any, b: any) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        photos.sort((a: any, b: any) => b.title.localeCompare(a.title));
        break;
      case "album-asc":
        photos.sort((a: any, b: any) => a.albumId - b.albumId);
        break;
      case "album-desc":
        photos.sort((a: any, b: any) => b.albumId - a.albumId);
        break;
      case "oldest":
        photos.sort((a: any, b: any) => a.id - b.id);
        break;
      case "newest":
      default:
        photos.sort((a: any, b: any) => b.id - a.id);
        break;
    }

    const startIdx = (+page - 1) * +limit;
    const endIdx = startIdx + +limit;
    const paginatedPhotos = photos.slice(startIdx, endIdx);

    //get random image
    const updatedPhotos = paginatedPhotos.map((photo: any, index: number) => {
      const imageIndex = (startIdx + index) % REAL_IMAGES.length;
      return {
        ...photo,
        thumbnailUrl: REAL_IMAGES[imageIndex],
        url: REAL_IMAGES[imageIndex],
      };
    });

    const nextCursor = endIdx < photos.length ? +page + 1 : null;

    return new Response(
      JSON.stringify({
        data: updatedPhotos,
        nextCursor: nextCursor,
        totalCount: photos.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching photos:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch photos" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, url, thumbnailUrl, albumId } = body;
    const res = await axios.post(apiUrl, {
      id,
      title,
      url,
      thumbnailUrl,
      albumId,
    });
    return new Response(JSON.stringify(res.data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Lỗi khi thêm ảnh",
        details: error.response?.data?.message || error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
