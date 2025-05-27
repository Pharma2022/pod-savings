import { db } from "@/db";
import { savings } from "@/db/schema";
import { asc, sql } from "drizzle-orm";

export async function GET() {
  const currentMonth = new Date().getMonth() + 1; // ✅ Get current month (JS months are 0-based)
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1; // ✅ Handle January case

  const result = await db
    .select({
      date: sql<string>`TO_CHAR(${savings.date_created}, 'YYYY-MM-DD')`, // ✅ Exact transaction date
      month: sql<string>`TO_CHAR(${savings.date_created}, 'Mon')`,
      amount: savings.savings, // ✅ Individual transaction amounts
    })
    .from(savings)
    .where(sql`EXTRACT(MONTH FROM ${savings.date_created}) IN (${lastMonth}, ${currentMonth})`) // ✅ Dynamically filter
    .orderBy(asc(savings.date_created)); // ✅ Keep transactions in order

  return Response.json(result);
}
