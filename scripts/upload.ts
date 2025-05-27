import "dotenv/config";
import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import { db, client } from "../db/index";
import { drugCostIndex } from "../db/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function uploadCSV(filePath: string) {
  const parser = fs.createReadStream(filePath).pipe(
    parse({ columns: true, skip_empty_lines: true })
  );

  const records: { drugName: string; drugCost: number }[] = [];

  for await (const record of parser) {
    const drugName = record.drug_name?.trim();
    const drugCost = parseFloat(record.drug_cost);
    if (!drugName || isNaN(drugCost)) continue;
    records.push({ drugName, drugCost });
  }

  try {
    await db.insert(drugCostIndex).values(records);
    console.log(`✅ Inserted ${records.length} records`);
  } catch (error) {
    console.error("❌ Insert failed:", error);
  } finally {
    await client.end({ timeout: 5 });
  }
}

uploadCSV(join(__dirname, "cost.csv")).catch(console.error);
