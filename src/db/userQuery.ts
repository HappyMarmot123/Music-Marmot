import { db } from "./dbConnection";
import { users } from "./userSchema";
import { eq } from "drizzle-orm";
import { User as SupabaseUser } from "@supabase/supabase-js";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export async function findUserById(userId: string): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return result[0];
}

export async function createUser(supabaseUser: SupabaseUser): Promise<User> {
  const result = await db
    .insert(users)
    .values({
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name:
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.user_metadata?.name ||
        supabaseUser.email,
      createdAt: new Date(),
      lastSignInAt: new Date(),
    })
    .returning();
  return result[0];
}

export async function updateUserSignIn(
  userId: string,
  email: string,
  name?: string
): Promise<User> {
  const result = await db
    .update(users)
    .set({
      email: email,
      name: name,
      lastSignInAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();
  return result[0];
}
