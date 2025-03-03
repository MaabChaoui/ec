"use client";
import React from "react";
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
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border min-h-[800px] flex flex-col">
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                // Assume the row's original data is of type User.
                const user = row.original as User;
                return (
                  <Dialog key={row.id}>
                    <DialogTrigger asChild>
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
                        onSubmit={(e) => {
                          e.preventDefault();
                          // Implement your save logic here.
                        }}
                      >
                        <div>
                          <label className="block text-sm font-medium">
                            ID
                          </label>
                          <Input
                            type="text"
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
                        <div>
                          <label className="block text-sm font-medium">
                            Updated At
                          </label>
                          <Input
                            type="text"
                            placeholder={new Date(
                              user.updated_at,
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
                            defaultValue={user.email}
                            className="mt-1 block w-full border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">
                            Status
                          </label>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={user.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Deactivated">
                                Deactivated
                              </SelectItem>
                              <SelectItem value="Suspended">
                                Suspended
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium">
                            Role
                          </label>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={user.role} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
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
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
