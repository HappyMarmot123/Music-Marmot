import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createUser } from "@/entities/User/userQuery";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (session?.user) {
      const { id: uid, email, user_metadata } = session.user;
      if (uid && email) {
        const userToCreate = {
          uid,
          email,
          avatar_url: user_metadata?.avatar_url,
          full_name: user_metadata?.full_name,
        };
        // Create user in our DB
        await createUser(userToCreate);
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}
