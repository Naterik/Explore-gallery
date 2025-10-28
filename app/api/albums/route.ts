import axios from "axios";
const apiUrl =
  process.env.API_ALBUMS || "https://jsonplaceholder.typicode.com/albums";
export async function GET(request: Request) {
  try {
    const res = await axios.get(apiUrl);
    return new Response(
      JSON.stringify({
        data: res.data,
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
