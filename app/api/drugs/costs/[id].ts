import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { drugCostIndex } from "@/db/schema";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { drugName, drugCost } = await req.json();

    await db.update(drugCostIndex)
      .set({ drugName, drugCost })
      .where({ id: Number(params.id) });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error updating drug cost:", err);
    return NextResponse.json({ error: "Failed to update drug cost" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(drugCostIndex).where({ id: Number(params.id) });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting drug cost:", err);
    return NextResponse.json({ error: "Failed to delete drug cost" }, { status: 500 });
  }
}
