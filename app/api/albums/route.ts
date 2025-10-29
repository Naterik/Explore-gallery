import { readDb } from "@/lib/readfile";
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
