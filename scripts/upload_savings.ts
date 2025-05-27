import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import { db } from "@/db";
import { users, drugCostIndex, savings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

type CsvRow = {
  email: string;
  drug_name: string;
  drug_cost: string;
  quantity: string;
  date_created: string;
};

async function uploadSavings(filePath: string) {
  const parser = fs
    .createReadStream(filePath)
    .pipe(
      parse({
        columns: (header) => header.map((h) => h.trim().toLowerCase()),
        skip_empty_lines: true,
      })
    );

  console.log(`📥 Starting upload from: ${filePath}`);

  for await (const row of parser as AsyncIterable<CsvRow>) {
    const email = row.email?.trim().toLowerCase();
    const drugName = row.drug_name?.trim();

    const rawCost = row.drug_cost?.trim().replace("£", "").replace(",", "");
    const cost = rawCost ? parseFloat(rawCost) : NaN;

    const rawQty = row.quantity?.trim().replace(",", "");
    const quantity = rawQty ? parseInt(rawQty, 10) : NaN;

    const dateStr = row.date_created?.trim();

    if (!email || !drugName || isNaN(cost) || isNaN(quantity) || !dateStr) {
      console.warn("⚠️ Skipping invalid row:", {
        email,
        drugName,
        cost,
        quantity,
        dateStr,
        rawDrugCost: row.drug_cost,
        original: row,
      });
      continue;
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error(`❌ Invalid date for ${email} - ${drugName}: ${dateStr}`);
      continue;
    }

    try {
      // Find or create user
      let user = await db.query.users.findFirst({ where: eq(users.email, email) });
      if (!user) {
        const newUser = { id: uuidv4(), email };
        await db.insert(users).values(newUser);
        user = newUser;
        console.log(`✅ Created user: ${email}`);
      }

      // Find drug
      const drug = await db.query.drugCostIndex.findFirst({
        where: eq(drugCostIndex.drugName, drugName),
      });

      if (!drug) {
        console.error(`❌ Drug not found: ${drugName}`);
        continue;
      }

      // Insert savings entry
      await db.insert(savings).values({
        drugId: drug.id,
        userId: user.id,
        drug_cost: cost, // Ensure this matches your DB schema
        quantity,
        date_created:date,
      });

      console.log(`✅ Saved: ${email} - ${drugName}`);
    } catch (err) {
      console.error(`❌ Error processing row for ${email} - ${drugName}:`, err);
    }
  }

  console.log("✅ Upload complete.");
}

// Adjust path as needed
uploadSavings(path.resolve(__dirname, "savings1.csv")).catch((err) => {
  console.error("❌ Script failed:", err);
});
