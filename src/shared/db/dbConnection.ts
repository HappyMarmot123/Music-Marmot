import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/* 
    TODO: Why drizzle ORM?
    Drizzle은 가볍고, 성능이 뛰어나며, 타입이 안전하고, 유당 불내증이 없고, 
    글루텐 불내증이 없으며, 냉정하고, 유연하며, 서버리스 환경에 최적화되어 설계 되었습니다.
    SQL과 유사한 키워드로 체이닝메소드 기법으로 사용
*/
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set in .env.local for the database client."
  );
}

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);
