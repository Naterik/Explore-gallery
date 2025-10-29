import { readDb, writeDb } from "@/lib/readfile";
import { NextRequest } from "next/server";

const db = await readDb();
const limit = +process.env.LIMIT_PER_PAGE! || 10;
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("_page") || "1";
    const search = searchParams.get("search")?.toLowerCase() || "";
    const album = searchParams.get("albumId") || "";
    const sort = searchParams.get("sort") || "newest";

    let photos = [...db.photos];

    const albumNum = album ? +album : null;
    let filterPhotos = photos.filter((p: IPhoto) => {
      const searchTitle = p.title.toLowerCase().includes(search);
      const filterAlbums =
        !albumNum || (albumNum > 0 && p.albumId === albumNum);
      return searchTitle && filterAlbums;
    });

    // Sort
    switch (sort) {
      case "title-asc":
        filterPhotos.sort((a: any, b: any) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filterPhotos.sort((a: any, b: any) => b.title.localeCompare(a.title));
        break;
      case "oldest":
        filterPhotos.sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "newest":
      default:
        filterPhotos.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    // Pagination
    const startIdx = (+page - 1) * +limit;
    const endIdx = startIdx + +limit;
    const paginatedPhotos = filterPhotos.slice(startIdx, endIdx);
    const nextCursor = endIdx < filterPhotos.length ? +page + 1 : null;

    return new Response(
      JSON.stringify({
        data: paginatedPhotos,
        nextCursor: nextCursor,
        totalCount: filterPhotos.length,
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
    const { title, url, thumbnailUrl, albumId } = body;
    const maxId = Math.max(...db.photos.map((p: any) => p.id), 0);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )}`;

    const newPhoto = {
      id: maxId + 1,
      albumId,
      title,
      url,
      thumbnailUrl,
      createdAt: `${dateStr}T${timeStr}`,
    };
    db.photos.push(newPhoto);
    await writeDb(db);
    return new Response(JSON.stringify(newPhoto), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Lỗi khi thêm ảnh",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
