import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Ensure DATABASE_URL is available
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("❌ DATABASE_URL is not defined");
}

// Setup postgres.js with SSL for Neon
const client = postgres(connectionString, { ssl: 'require' });

// Export drizzle client and raw SQL client
export const db = drizzle(client, { schema });
export { client };
