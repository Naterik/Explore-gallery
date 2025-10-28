import { REAL_IMAGES } from "@/public/seed";
import axios from "axios";
import { get } from "http";

const apiUrl =
  process.env.API_PHOTOS || "https://jsonplaceholder.typicode.com/photos";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("_page") || "1";
    const limit = "10";
    const res = await axios.get(`${apiUrl}?_page=${+page}&_limit=${limit}`);
    const photos = res.data;
    const updatedPhotos = photos.map((photo: any, index: number) => {
      const imageIndex = (parseInt(page) * 10 + index) % REAL_IMAGES.length;
      return {
        ...photo,
        thumbnailUrl: REAL_IMAGES[imageIndex],
        url: REAL_IMAGES[imageIndex],
      };
    });
    const nextCursor =
      photos.length === parseInt(limit) ? parseInt(page) + 1 : null;
    return new Response(
      JSON.stringify({
        data: updatedPhotos,
        nextCursor: nextCursor,
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
    // ✅ Sửa: Đọc JSON body thay vì formData
    const body = await request.json();
    const { id, title, url, thumbnailUrl, albumId } = body;

    // ✅ Validate dữ liệu trước khi gửi
    if (!title || !url) {
      return new Response(
        JSON.stringify({ error: "Title và URL là bắt buộc" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Gửi lên JSONPlaceholder
    const res = await axios.post(apiUrl, {
      id: id || Math.random().toString(36).substr(2, 9),
      title,
      url,
      thumbnailUrl: thumbnailUrl || url,
      albumId: albumId || 1,
    });

    console.log("✅ Ảnh đã thêm:", res.data);

    return new Response(JSON.stringify(res.data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(
      "❌ Lỗi khi thêm ảnh:",
      error.response?.data || error.message
    );
    return new Response(
      JSON.stringify({
        error: "Lỗi khi thêm ảnh",
        details: error.response?.data?.message || error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
