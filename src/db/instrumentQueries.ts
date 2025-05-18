import { db } from "@/db/dbConnection";
import { instruments as instrumentsSchema } from "@/db/instrumentSchema";

export async function getAllInstruments() {
  // noStore(); // 서버 컴포넌트에서 항상 최신 데이터를 가져오려면 주석 해제

  try {
    console.log("Fetching instruments from the database...");
    const data = await db.select().from(instrumentsSchema);
    console.log("Fetched instruments:", data);
    return data;
  } catch (error) {
    console.error("Database Error - Failed to fetch instruments:", error);
    return [];
  }
}
