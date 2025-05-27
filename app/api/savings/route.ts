import { db } from "@/db"; // ✅ Ensure the database connection is imported
import { savings, drugCostIndex, users } from "@/db/schema"; // ✅ Import schema correctly
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15;
    const offset = (page - 1) * limit;

    // ✅ Ensure correct table joins for fetching user emails and drug names
    const entries = await db
      .select({
        id: savings.id,
        userId: savings.userId,
        userEmail: users.email, // ✅ Fetch user email from `users` table
        drugId: savings.drugId,
        drugName: drugCostIndex.drugName, // ✅ Fetch drug name from `drug_cost_index`
        quantity: savings.quantity,
        costPerDrug: savings.drug_cost,
        savings: savings.savings,
        dateCreated: savings.date_created,
      })
      .from(savings)
      .leftJoin(users, sql`savings.user_id = users.id`) // ✅ Correct join for fetching user email
      .leftJoin(drugCostIndex, sql`savings.drug_id = ${sql.raw("drug_cost_index.id")}`)
 // ✅ Correct join for fetching drug names
      .orderBy(sql`${savings.date_created} DESC`)
      .limit(limit)
      .offset(offset)
      .execute();

    console.log("📦 Executing Query:", entries); // ✅ Debugging API response

    return NextResponse.json(entries);
  } catch (err) {
    console.error("❌ Server Error:", err); // ✅ Logs detailed backend error
    return NextResponse.json({ error: "Failed to fetch savings data", details: err.message }, { status: 500 });
  }
}
