import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "lib", "db.json");

// Hàm để read db.json
async function readDb() {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { users: [], albums: [], photos: [] };
  }
}

// Hàm để write db.json
async function writeDb(data: any) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing db.json:", error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("_page") || "1";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    const albumId = searchParams.get("albumId") || null;
    const limit = "10";

    const db = await readDb();
    let photos = [...db.photos];

    if (search) {
      photos = photos.filter((photo: any) =>
        photo.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (albumId) {
      photos = photos.filter((photo: any) => photo.albumId === +albumId);
    }

    switch (sort) {
      case "title-asc":
        photos.sort((a: any, b: any) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        photos.sort((a: any, b: any) => b.title.localeCompare(a.title));
        break;
      case "oldest":
        photos.sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "newest":
      default:
        photos.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    const startIdx = (+page - 1) * +limit;
    const endIdx = startIdx + +limit;
    const paginatedPhotos = photos.slice(startIdx, endIdx);

    const nextCursor = endIdx < photos.length ? +page + 1 : null;

    return new Response(
      JSON.stringify({
        data: paginatedPhotos,
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
    const { title, url, thumbnailUrl, albumId } = body;

    // Read current db
    const db = await readDb();

    // Tìm ID lớn nhất
    const maxId = Math.max(...db.photos.map((p: any) => p.id), 0);

    const newPhoto = {
      id: maxId + 1,
      albumId: albumId || 1,
      title: title || "New Photo",
      url: url || "https://via.placeholder.com/600",
      thumbnailUrl: thumbnailUrl || "https://via.placeholder.com/150",
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Thêm vào photos array
    db.photos.push(newPhoto);

    // Write lại vào db.json file
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
