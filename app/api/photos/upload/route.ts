import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

// ✅ API để upload file ảnh
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const albumId = formData.get("albumId") as string;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "File không được tìm thấy" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Tạo tên file duy nhất
    const ext = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // ✅ Tạo thư mục nếu chưa có
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ Lưu file
    const buffer = await file.arrayBuffer();
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // ✅ URL công khai của ảnh
    const imageUrl = `/uploads/${fileName}`;

    console.log("✅ Upload file thành công:", imageUrl);

    // ✅ Gửi data lên JSONPlaceholder (tùy chọn)
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/photos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id || uuidv4(),
          title,
          url: imageUrl,
          thumbnailUrl: imageUrl,
          albumId: albumId || 1,
        }),
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify({
        ...data,
        url: imageUrl,
        thumbnailUrl: imageUrl,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("❌ Lỗi khi upload file:", error);
    return new Response(
      JSON.stringify({
        error: "Lỗi khi upload file",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
