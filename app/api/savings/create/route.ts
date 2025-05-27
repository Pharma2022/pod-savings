import { db } from "@/db";
import { savings } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.json();

  const result = await db.insert(savings).values({
    userId: body.userId,
    drugId: body.drugId,
    quantity: body.quantity,
    costPerDrug: body.costPerDrug,
    savings: body.savings,
    dateCreated: new Date(body.dateCreated),
  });

  return Response.json({ success: true });
}
