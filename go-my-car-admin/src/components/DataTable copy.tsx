import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

// Sample Data
const data = [
  { id: 1, name: "John Doe", age: 28 },
  { id: 2, name: "Jane Smith", age: 34 },
  { id: 3, name: "Alice Johnson", age: 25 },
  { id: 4, name: "Bob Brown", age: 40 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
  { id: 5, name: "Charlie White", age: 22 },
];

// Column Definitions
const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

const DataTable = () => {
  const [globalFilter, setGlobalFilter] = useState(""); // For Searching

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="p-4">
      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search..."
        className="mb-2 p-2 border rounded w-full"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)} 
      />

      {/* 📊 Table */}
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-gray-300 p-2 cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc"
                    ? " 🔼"
                    : header.column.getIsSorted() === "desc"
                    ? " 🔽"
                    : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📌 Pagination Controls */}
      <div className="flex items-center gap-2 mt-2">
        <button
          className="p-1 border rounded disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          className="p-1 border rounded disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
