import { NextResponse } from "next/server";
import { createUser, User as DbUser } from "@/entities/User/userQuery";
import { CustomUserMetadata } from "@/shared/types/dataType";

export async function POST(request: Request) {
  try {
    const userData = (await request.json()) as CustomUserMetadata;

    if (!userData.uid || !userData.email) {
      return NextResponse.json(
        { error: "UID or Email is missing in request body" },
        { status: 400 }
      );
    }

    const existingUser: DbUser | null = await createUser(userData);

    if (existingUser) {
      return NextResponse.json(existingUser, { status: 200 });
    }
  } catch (error) {
    console.error("API Error in /api/users POST:", error);
    return NextResponse.json(error, { status: 500 });
  }
}
