import { REAL_IMAGES } from "@/public/seed";
import axios from "axios";

const apiUrl = process.env.API || "https://jsonplaceholder.typicode.com/photos";

// Danh sách ảnh Pexels full size (ảnh lớn để xem chi tiết)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await axios.get(`${apiUrl}/${id}`);
    const photo = res.data;

    // Map ảnh thật cho ảnh chi tiết
    const imageIndex = (parseInt(id) - 1) % REAL_IMAGES.length;

    return new Response(
      JSON.stringify({
        ...photo,
        url: REAL_IMAGES[imageIndex],
        thumbnailUrl: REAL_IMAGES[imageIndex],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching photo:", error);
    return new Response(JSON.stringify({ error: "Photo not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}
