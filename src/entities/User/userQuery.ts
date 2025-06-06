import { db } from "@/shared/db/dbConnection";
import { users } from "@/entities/User/userSchema";
import { eq, and } from "drizzle-orm";
import { CustomUserMetadata } from "@/shared/types/dataType";
import { cache } from "react";

/*
  TODO: react cache()
  넥스트 내장 api (예: fetch) 재외하면 유용한 react19 훅훅
*/
export type User = typeof users.$inferSelect;

export const findUser = cache(async (uid: string): Promise<User | null> => {
  if (!uid) {
    console.error("UID or Email is missing in socialUser data");
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.uid, uid)))
    .limit(1);
  return user[0];
});

export async function createUser(
  socialUser: CustomUserMetadata
): Promise<User | null> {
  try {
    const user = await findUser(socialUser.uid);
    if (user) {
      console.log("User already exists:", user);
      return user;
    }

    const newUser = {
      uid: socialUser.uid,
      email: socialUser.email,
      full_name: socialUser.full_name,
      avatar_url: socialUser.avatar_url,
    };

    const result = await db.insert(users).values(newUser).returning();

    if (result.length > 0) {
      console.log("User created successfully:", result[0]);
      return result[0] as User;
    }
    console.warn(
      "User creation might have failed as returning() yielded an empty array."
    );
    return null;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
}
