"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./DatePicker";
import { clientPodSchema } from "@/validation/schema";
import { DrugAutocomplete } from "./DrugAutoComplete";

type FormValues = z.infer<typeof clientPodSchema>;

export function PodForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(clientPodSchema),
    defaultValues: {
      quantity: 1,
      date: new Date(),
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  // Debug-based drug fetch logic
  const [drugList, setDrugList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const res = await fetch("/api/drugs");
        if (!res.ok) throw new Error("Failed to fetch drugs");

        const data = await res.json();
        console.log("📦 Drugs fetched:", data);

        const names = data.map((d: any) => d.drugName);
        setDrugList(names);
      } catch (err: any) {
        console.error("❌ Drug fetch error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchDrugs();
  }, []);

  const onSubmit = (data: FormValues) => {
    console.log("✅ Submitted data:", data);
    // TODO: send to your API
  };

  return (
    <FormProvider {...form}>
      <h1 className="p-2">Record Pod Saving</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        {/* Drug Autocomplete */}
        <div>
          <DrugAutocomplete
            drugList={drugList}
            loading={loading}
            error={!!error}
          />
          {errors.drug && (
            <p className="text-sm text-red-500 mt-1">
              {errors.drug.message}
            </p>
          )}
        </div>

        {/* Quantity Input */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Quantity (1–10)</label>
          <Input
            type="number"
            {...form.register("quantity", { valueAsNumber: true })}
            min={1}
            max={10}
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity.message}</p>
          )}
        </div>

        {/* Date Picker */}
        <div>
          <DatePicker />
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">
              {errors.date.message}
            </p>
          )}
        </div>

        <Button type="submit">Submit</Button>

        <div className="p-2">
          <h2>Drug not on form?</h2>
          <p className="text-muted-foreground">
            Please email Sima, Lucia, Aneta or Norica, Jurgita or Jide to add the drug to the form.
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
