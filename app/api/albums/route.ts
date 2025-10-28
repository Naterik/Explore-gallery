import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "lib", "db.json");

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { users: [], albums: [], photos: [] };
  }
}

export async function GET(request: Request) {
  try {
    const db = await readDb();
    return new Response(
      JSON.stringify({
        data: db.albums,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching albums:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch albums" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
