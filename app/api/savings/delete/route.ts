import { db } from "@/db";
import { savings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await db.delete(savings).where(eq(savings.id, id));

  return Response.json({ success: true });
}
