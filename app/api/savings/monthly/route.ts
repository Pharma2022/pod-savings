 import { db } from "@/db";
import { savings } from "@/db/schema";
import { asc, sql } from "drizzle-orm";

export async function GET() {
  const result = await db
    .select({
      month: sql<string>`TO_CHAR(${savings.date_created}, 'Mon')`,
      total: sql<number>`SUM(${savings.savings})`,
    })
    .from(savings)
    .groupBy(sql`TO_CHAR(${savings.date_created}, 'Mon')`)
    .orderBy(asc(sql`MIN(${savings.date_created})`));

  return Response.json(result);
}
