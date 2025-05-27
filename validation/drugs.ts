export  const drugsList= [
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Metformin",
  "Atorvastatin",
  "Omeprazole",
  "Lisinopril",
  "Amlodipine",
  "Simvastatin",
  "Losartan",
  "Salbutamol",
  "Levothyroxine",
  "Gabapentin",
  "Sertraline",
  "Citalopram",
  "Fluoxetine",
  "Amitriptyline",
  "Prednisolone",
  "Furosemide",
  "Co-codamol",
  "Warfarin",
  "Ramipril",
  "Clopidogrel",
  "Naproxen",
  "Cetirizine",
  "Hydrochlorothiazide",
  "Propranolol",
  "Ranitidine",
  "Diazepam",
  "Codeine"
];


import { pgTable, text, numeric } from "drizzle-orm/pg-core";

// This matches your existing table in Neon
export const drugs = pgTable("drugs", {
  name: text("name").notNull().primaryKey(),
  price: numeric("price").notNull(), // precise numeric (like DECIMAL or NUMERIC in SQL)
});
