"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DrugAutocomplete({
  drugList,
  loading,
  error,
}: {
  drugList: string[];
  loading: boolean;
  error: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { setValue, watch } = useFormContext();
  const selected = watch("drug");

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Drug</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading || error}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading drugs...
              </>
            ) : error ? (
              "Failed to load drugs"
            ) : (
              <>
                {selected || "Select a drug"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search drug..." className="h-9" />
            <CommandEmpty>No drug found.</CommandEmpty>
            <CommandGroup>
              {drugList.map((drug) => (
                <CommandItem
                  key={drug}
                  value={drug}
                  onSelect={(value) => {
                    setValue("drug", value, { shouldValidate: true });
                    console.log("✅ Drug selected:", value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === drug ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {drug}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
