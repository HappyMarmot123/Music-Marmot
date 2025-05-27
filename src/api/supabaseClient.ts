import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import { createServerClient } from "@supabase/ssr";

/* 
    TODO: Why Supabase?
    RDMBS 백앤드 서비스 PostgreSQL
    WebSockets, OAuth, 이메일 로그인, Magic Link 등 필수기능 지원
    웹, 모바일 둘 다 강력한 지원
    엿같은 Firebase ODM 말고 Prisma 기본지원

    @supabase/ssr createServerClient has fucking deprecated 
*/
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClientComponentClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
});
