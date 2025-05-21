import { db } from "./dbConnection";
import { users } from "./userSchema";
import { eq, or, SQL } from "drizzle-orm";
import { CustomUserMetadata } from "@/type/dataType";

export type User = typeof users.$inferSelect;

export async function createUser(
  socialUser: CustomUserMetadata
): Promise<User | null> {
  if (!socialUser.uid || !socialUser.email) {
    console.error("UID or Email is missing in socialUser data");
    return null;
  }

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(
        or(eq(users.uid, socialUser.uid), eq(users.email, socialUser.email))
      )
      .limit(1);

    if (existingUser.length > 0) {
      console.log("User already exists:", existingUser[0]);
      return existingUser[0] as User;
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
