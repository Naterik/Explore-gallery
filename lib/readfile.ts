import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "lib", "db.json");

export async function readDb() {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { users: [], albums: [], photos: [] };
  }
}

export async function writeDb(data: any) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing db.json:", error);
    throw error;
  }
}
