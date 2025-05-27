"use client";
import { parse,unparse } from "papaparse";
import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface SavingEntry {
  id: number;
  userId: string;
  userEmail: string;
  drugId: number;
  drugName: string;
  quantity: number;
  costPerDrug: number;
  savings: number;
  dateCreated: string;
}

const PAGE_SIZE = 15;

export default function SavingsTable() {
  const [data, setData] = useState<SavingEntry[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/savings?page=${page}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const raw = await response.json();
        setData(raw);
      } catch (error) {
        console.error("❌ Error loading data:", error);
      }
    }

    loadData();
  }, [page]);


const exportToCSV = () => {
  if (!data || data.length === 0) {
    console.error("❌ No data available for export.");
    return;
  }

  // ✅ Remove "£" symbol, store numbers cleanly
  const formattedData = data.map((entry) => ({
    User_Email: entry.userEmail,
    Drug_Name: entry.drugName,
    Quantity: entry.quantity,
    Cost: Number(entry.costPerDrug || 0).toFixed(2), // No "£"
    Savings: Number(entry.savings || 0).toFixed(2),  // No "£"
    Date: entry.dateCreated.slice(0, 10),
  }));

  // ✅ Convert JSON to CSV with UTF-8 encoding
  const csv = unparse(formattedData);

  // ✅ Ensure correct UTF-8 encoding to prevent "Â" characters
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "savings_data.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  const columns: ColumnDef<SavingEntry>[] = [
    { header: "User", accessorKey: "userEmail" },
    { header: "Drug", accessorKey: "drugName" },
    { header: "Quantity", accessorKey: "quantity" },
    {
      header: "Cost (£)",
      accessorKey: "costPerDrug",
      cell: ({ getValue }) => `£${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Savings (£)",
      accessorKey: "savings",
      cell: ({ getValue }) => `£${Number(getValue()).toFixed(2)}`,
    },
    {
      header: "Date",
      accessorKey: "dateCreated",
      cell: ({ getValue }) => String(getValue()).slice(0, 10),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">All Savings</h1>
        <Button onClick={exportToCSV} className="bg-green-500 text-white px-4 py-2">
          Export as CSV
        </Button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border p-2 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-4">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="border px-4 py-2 bg-gray-200 disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button
          onClick={() => setPage((p) => p + 1)}
          className="border px-4 py-2 bg-gray-200"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
