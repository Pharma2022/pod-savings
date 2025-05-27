// app/api/users/route.ts
import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  const allUsers = await db.select().from(users);
  return Response.json(allUsers);
}
