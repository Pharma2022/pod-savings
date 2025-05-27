import { db } from "@/db";
import { savings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
  const body = await req.json();

  await db
    .update(savings)
    .set({
      userId: body.userId,
      drugId: body.drugId,
      quantity: body.quantity,
      costPerDrug: body.costPerDrug,
      savings: body.savings,
      dateCreated: new Date(body.dateCreated),
    })
    .where(eq(savings.id, body.id));

  return Response.json({ success: true });
}
