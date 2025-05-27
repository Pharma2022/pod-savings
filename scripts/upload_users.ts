import { db } from "@/db"; // adjust the path to your db client
import { users } from "@/db/schema"; // adjust to where you defined the schema
import { eq } from "drizzle-orm";

const userEmails = [
  "aneta.rysak@nhs.net",
  "annamaria.boros@nhs.net",
  "bela.patel5@nhs.net",
  "eleonorica.balanica@nhs.net",
  "jide.aderibigbe@nhs.net",
  "jurgita.svegzdiene@nhs.net",
  "nadeera.wedagedara@nhs.net",
  "shah.aowal@nhs.net",
  "sima.jadeja@nhs.net",
];

async function insertUsers() {
  for (const email of userEmails) {
    try {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existing.length === 0) {
        await db.insert(users).values({ email });
        console.log(`✅ Inserted ${email}`);
      } else {
        console.log(`ℹ️ Skipped ${email} (already exists)`);
      }
    } catch (err) {
      console.error(`❌ Failed to insert ${email}:`, err);
    }
  }
}

insertUsers().then(() => process.exit());
