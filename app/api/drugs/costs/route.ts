import { db } from "@/db";
import { drugCostIndex } from "@/db/schema";
import { sql } from "drizzle-orm/sql";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 25);
    const limit = parseInt(url.searchParams.get("limit") || "25", 25);
    const search = url.searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    // ✅ Base query
    let query = db.select().from(drugCostIndex);

    // ✅ Apply search filter if term exists
 if (search) {
  query = query.where(sql`drug_name ILIKE ${'%' + search + '%'}`); // ✅ Proper Drizzle syntax
}


    // ✅ Apply pagination after filtering
    query = query.limit(limit).offset(offset);

    console.log("🔍 Executing query:", query.toSQL());

    const drugCosts = await query.execute(); // ✅ Ensure query execution
    return NextResponse.json(drugCosts);
  } catch (err) {
    console.error("❌ Error fetching drug costs:", err);
    return NextResponse.json(
      { error: "Failed to fetch drug costs" },
      { status: 500 }
    );
  }
}
