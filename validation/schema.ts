import { z } from "zod";

export const clientPodSchema = z.object({
  drug: z.string().min(1, "Please select a drug."),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, "Minimum quantity is 1")
    .max(10, "Maximum quantity is 10"),
  date: z
    .date({ invalid_type_error: "Please pick a valid date" })
    .max(new Date(), "Date cannot be in the future"),
});

// Strict version for backend/API
export const createPodSchema = (drugNames: string[]) => {
  const drugLiterals = drugNames.map(z.literal) as unknown as [
    z.ZodLiteral<string>,
    ...z.ZodLiteral<string>[]
  ];

  return z.object({
    drug: z.union(drugLiterals),
    quantity: z
      .number({ invalid_type_error: "Quantity must be a number" })
      .min(1, "Minimum quantity is 1")
      .max(10, "Maximum quantity is 10"),
    date: z
  .date({ invalid_type_error: "Please pick a valid date" })
  .max(new Date(), "Date must not be in the future"),
  });
};
