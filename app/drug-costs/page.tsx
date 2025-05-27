"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DrugEntry {
  id: number;
  drugName: string;
  drugCost: number;
}

const PAGE_SIZE = 10;

export default function DrugCostsTable() {
  const [data, setData] = useState<DrugEntry[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDrugs, setEditedDrugs] = useState<Record<number, Partial<DrugEntry>>>({});
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (newPage: number) => {
    if (!hasMore && newPage > page) return; // ✅ Prevent fetch if at last page

    setIsLoading(true);
    try {
      console.log(`🔍 Fetching page ${newPage}, searching for "${searchTerm}"...`);
      const response = await fetch(`/api/drugs/costs?page=${newPage}&limit=${PAGE_SIZE}&search=${searchTerm}`);
      if (!response.ok) throw new Error(`API responded with status ${response.status}`);

      const drugs = await response.json();
      console.log("📦 API Response:", drugs);

      setData(
        drugs.map((drug: any) => ({
          id: drug.id,
          drugName: drug.drugName ?? "Unknown",
          drugCost: drug.drugCost !== undefined ? parseFloat(drug.drugCost) : 0,
        }))
      );

      setHasMore(drugs.length >= PAGE_SIZE); // ✅ Disable "Next" when fewer entries are returned
      setPage(newPage);
    } catch (error) {
      console.error("❌ Error fetching drug costs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [searchTerm]);

  const updateEntry = (id: number, updates: Partial<DrugEntry>) => {
    setEditedDrugs((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }));
  };

  const saveChanges = async (id: number) => {
    try {
      await fetch(`/api/drugs/costs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedDrugs[id]),
      });

      setData((prev) =>
        prev.map((drug) => (drug.id === id ? { ...drug, ...editedDrugs[id] } : drug))
      );
      setEditedDrugs((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error) {
      console.error("❌ Failed to update drug:", error);
    }
  };

  const columns: ColumnDef<DrugEntry>[] = [
    {
      header: "Drug Name",
      accessorKey: "drugName",
      cell: ({ row }) =>
        isEditing ? (
          <Input
            type="text"
            value={editedDrugs[row.original.id]?.drugName ?? row.original.drugName}
            onChange={(e) =>
              updateEntry(row.original.id, { drugName: e.target.value })
            }
          />
        ) : (
          <span>{row.original.drugName}</span>
        ),
    },
    {
      header: "Drug Cost (£)",
      accessorKey: "drugCost",
      cell: ({ row }) =>
        isEditing ? (
          <Input
            type="number"
            value={(editedDrugs[row.original.id]?.drugCost ?? row.original.drugCost).toString()}
            onChange={(e) =>
              updateEntry(row.original.id, { drugCost: parseFloat(e.target.value) })
            }
          />
        ) : (
          <span>£{row.original.drugCost.toFixed(2)}</span>
        ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) =>
        isEditing ? (
          <Button onClick={() => saveChanges(row.original.id)}>Save</Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search drug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => fetchData(1)}>Search</Button>
      </div>

      {/* Drug Costs Table */}
      <div className="border p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-medium">{isEditing ? "Editable Drug Costs" : "Drug Costs"}</h2>

        <table className="w-full border text-sm mt-4">
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
              <tr key={row.id}>
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
          <Button onClick={() => fetchData(page - 1)} disabled={page === 1 || isLoading}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `Page ${page}`}
          </span>
          <Button onClick={() => fetchData(page + 1)} disabled={!hasMore || isLoading}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
