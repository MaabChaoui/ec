/* eslint-disable @typescript-eslint/no-unused-vars */
// components/documents/DataTable.tsx
"use client";
import React, { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

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
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments } from "../../../../store/features/documentsSlice";
import { Document } from "../../../../lib/definitions";
import { fetchDepartments } from "../../../../store/features/departmentsSlice";
import { fetchCategories } from "../../../../store/features/categoriesSlice";
import { useAppSelector } from "../../../../store/store";
import { updateDocumentAction } from "../../../../actions/documents/action";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  emptyMessage = "No documents found",
}: DataTableProps<TData, TValue>) {
  const dispatch = useDispatch();

  const { currentPage, totalPages, searchTerm } = useSelector(
    (state) => state.documents,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    dispatch(
      fetchDocuments({ page: newPage, perPage: 10, searchTerm: searchTerm }),
    );
  };

  const [selected, setSelected] = useState<Document | null>(null);
  const _columns: ColumnDef<TData, TValue>[] = [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button size="sm" onClick={() => setSelected(row.original as Document)}>
          Edit
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns: _columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const {
    categories,
    loading: cat_loading,
    error: cat_error,
  } = useAppSelector((state) => state.categories);

  const {
    departments,
    loading: dep_loading,
    error: dep_error,
  } = useAppSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const [categoryName, setCategoryName] = useState<string>("");
  const [departmentName, setDepartmentName] = useState<string>("");
  const [status, setStatus] = useState("");

  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="rounded-md border min-h-[400px] flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-3">
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
              <TableRow>
                <TableCell colSpan={_columns.length}>
                  <div className="space-y-4 p-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const doc = row.original as Document;

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      // setSelected(doc);
                    }}
                    className={
                      onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2">
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
                  colSpan={_columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
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

      {/* Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="dark:bg-transparent light:bg-white backdrop-blur-lg">
            <DialogHeader className="flex justify-center">
              <DialogTitle className="flex justify-center">
                Edit Document Metadata
              </DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                formData.set("id", selected.id.toString());
                /* ensure these field names match what you added to the form */
                formData.set("category", categoryName);
                formData.set("department", departmentName);
                formData.set("status", status);

                await updateDocumentAction([], formData);

                // setDocuments(updatedDocs);
                // try {
                //   // await updateDocumentAction(formData);
                //   setSelected(null);
                // } catch (err: any) {
                //   console.error("Error updating document:", err);
                // }
              }}
            >
              {/* ID (hidden) */}
              <Input type="hidden" name="id" value={selected.id} />

              {/* Displayed ID */}
              <div>
                <label className="block text-sm font-medium">ID</label>
                <Input
                  value={selected.id}
                  disabled
                  className="mt-1 block w-full bg-gray-100"
                />
              </div>

              {/* Created At */}
              <div>
                <label className="block text-sm font-medium">Created At</label>
                <Input
                  value={new Date(selected.creationDate).toLocaleString()}
                  disabled
                  className="mt-1 block w-full bg-gray-100"
                />
              </div>

              <Separator />

              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Title</label>
                <Input
                  name="title"
                  defaultValue={selected.title}
                  className="mt-1 block w-full"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium">Category</label>
                <Select
                  name="category"
                  value={categoryName}
                  onValueChange={setCategoryName}
                  className="mt-1 block w-full border rounded-md p-2 bg-background"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selected?.category} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium">Department</label>
                <Select
                  name="department"
                  value={departmentName}
                  // onChange={(e) => setDepartmentName(e.currentTarget.value)}
                  className="mt-1 block w-full border rounded-md p-2 bg-background"
                  onValueChange={setDepartmentName}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selected?.department} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div>
                <label className="block text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selected?.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="VERIFIED">VERIFIED</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                    <SelectItem value="REJECTED">REJECTED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center gap-2 pt-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelected(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
