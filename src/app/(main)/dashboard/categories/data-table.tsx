/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";

import { Category } from "../../../../lib/definitions";
import { fetchCategories } from "../../../../store/features/categoriesSlice";
import { formatDate } from "../../../../lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const dispatch = useDispatch();
  const { currentPage, totalPages, searchTerm } = useSelector(
    (state) => state.users,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(fetchCategories());
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [selected, setSelected] = useState<Category | null>(null);

  return (
    <div className="rounded-md border min-h-[400px] flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-sidebar">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array(10)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={`skeleton-cell-${index}-${colIndex}`}>
                        <Skeleton className="h-4 w-[80%]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                // Assume the row's original data is of type User.
                const dep = row.original as Category;

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelected(dep);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination area */}
      <div className="p-4 border-t">
        <div className="flex justify-center items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoading) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <span className="mx-2">of {totalPages}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoading) handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      {/* <Dialog key={row.id} open={diagOpen} onOpenChange={setDiagOpen}> */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="dark:bg-transparent  backdrop-blur-lg">
            <DialogHeader className="flex justify-center">
              <DialogTitle className="flex justify-center">
                Edit Category
              </DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                // TODO

                try {
                  // await updateUserAction([dep], formData);
                  setSelected(null);
                } catch (err: any) {
                  // TODO: show toast/snackbar: err.message
                  console.error(
                    "There was an error at updateUserAction: ",
                    err,
                  );
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium">ID</label>
                <Input type="hidden" name="id" value={selected.id} />
                <Input
                  placeholder={selected.id}
                  disabled
                  className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Created At</label>
                <Input
                  type="text"
                  // placeholder={new Date(
                  //   selected.createdAt ?? ""
                  // ).toLocaleString()}
                  placeholder={formatDate(selected.createdAt ?? "")}
                  disabled
                  className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <Separator />
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Input
                  type="text"
                  name="name"
                  defaultValue={selected.name}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-center gap-2 pt-10">
                <Button
                  type="button"
                  className="px-4 py-2 rounded bg-background text-foreground border hover:bg-gray-100 hover:text-gray-700"
                  onClick={() => {
                    setSelected(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-4 py-2">
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
