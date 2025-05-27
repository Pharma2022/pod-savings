import { db } from "@/db";
import { savings, drugCostIndex, users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 15;
    const offset = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    let query = db.select().from(savings).orderBy(sql`${savings.date_created} DESC`);

    // ✅ Apply search filter ONLY if search term exists
    if (search.trim()) {
      query = query.where(
        sql`user_id IN (SELECT id FROM ${users} WHERE email ILIKE ${'%' + search + '%'}) 
            OR drug_id IN (SELECT id FROM ${drugCostIndex} WHERE drug_name ILIKE ${'%' + search + '%'})`
      );
    }

    query = query.limit(limit).offset(offset);

    console.log("🔍 Executing SQL:", query.toSQL()); // ✅ Debugging query execution

    const entries = await query.execute();

    return NextResponse.json(entries);
  } catch (err) {
    console.error("❌ Error fetching savings data:", err);
    return NextResponse.json(
      { error: "Failed to fetch savings data" },
      { status: 500 }
    );
  }
}
