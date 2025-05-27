import {
  pgTable,
  uuid,
  text,
  serial,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

// drug_cost_index — unchanged
export const drugCostIndex = pgTable("drug_cost_index", {
  id: serial("id").primaryKey(),
  drugName: text("drug_name").notNull().unique(),
  drugCost: numeric("drug_cost", { precision: 5, scale: 2 }).notNull(),
});

// users — will auto-generate UUIDs on insert
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // ✅ Neon will handle this correctly
  email: text("email").notNull().unique(),
});

// savings — unchanged, foreign keys assumed handled at app level
export const savings = pgTable("savings", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  drugId: integer("drug_id").notNull(),
  quantity: integer("quantity").notNull(),
  drug_cost: numeric("drug_cost", { precision: 5, scale: 2 }).notNull(),
  savings: numeric("savings", { precision: 5, scale: 2 }).notNull(),
  date_created: timestamp("date_created").notNull(),
});
