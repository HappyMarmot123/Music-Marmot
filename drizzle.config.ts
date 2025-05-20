import { defineConfig } from "drizzle-kit";

/* 
    TODO: 
    drizzle-kit가 설정을 참조하여 마이그레이션 파일을 생성합니다.
*/
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
