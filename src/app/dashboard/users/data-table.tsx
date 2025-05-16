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
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";

import { fetchUsers } from "../../../store/features/usersSlice";
import { updateUserAction } from "../../../actions/users/action";

// User type as defined by your schema.
export type User = {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string;
  email: string;
  status: string;
  role: string; // Typically 'user' | 'admin'
  photo: string;
};

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
    dispatch(fetchUsers({ page: newPage, perPage: 5, searchTerm: searchTerm }));
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [diagOpen, setDiagOpen] = useState(false);

  // **Initialize** with the user’s current values
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

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
              Array(5)
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
                const user = row.original as User;

                return (
                  <Dialog
                    key={row.id}
                    open={diagOpen}
                    onOpenChange={setDiagOpen}
                  >
                    <DialogTrigger
                      asChild
                      onClick={() => {
                        setStatus(user.status);
                        setRole(user.role);
                      }}
                    >
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className="cursor-pointer"
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
                    </DialogTrigger>
                    <DialogContent className="bg-transparent backdrop-blur-lg">
                      <DialogHeader className="flex justify-center">
                        <DialogTitle className="flex justify-center">
                          Edit User
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        className="space-y-4"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          formData.set("role", role);
                          formData.set("status", status);
                          try {
                            await updateUserAction([user], formData);
                            setDiagOpen(false);
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
                          <label className="block text-sm font-medium">
                            ID
                          </label>
                          <Input type="hidden" name="id" value={user.id} />
                          <Input
                            placeholder={user.id}
                            disabled
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">
                            Created At
                          </label>
                          <Input
                            type="text"
                            placeholder={new Date(
                              user.created_at,
                            ).toLocaleString()}
                            disabled
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100"
                          />
                        </div>
                        <Separator />
                        <div>
                          <label className="block text-sm font-medium">
                            Name
                          </label>
                          <Input
                            type="text"
                            name="name"
                            defaultValue={user.name}
                            className="mt-1 block w-full border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">
                            Email
                          </label>
                          <Input
                            type="email"
                            name="email"
                            defaultValue={user.email}
                            className="mt-1 block w-full border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">
                            Status
                          </label>
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={user.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="DEACTIVATED">
                                DEACTIVATED
                              </SelectItem>
                              <SelectItem value="SUSPENDED">
                                SUSPENDED
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium">
                            Role
                          </label>
                          <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={user.role} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">ADMIN</SelectItem>
                              <SelectItem value="USER">USER</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Separator />
                        <div className="mb-6">
                          <label className="block text-sm font-medium">
                            New Password
                          </label>
                          <Input
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            className="mt-1 block w-full border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="flex justify-center gap-2 pt-10">
                          <Button
                            type="button"
                            className="px-4 py-2 rounded bg-background text-foreground border hover:bg-gray-100 hover:text-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="px-4 py-2">
                            Save
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
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
    </div>
  );
}
