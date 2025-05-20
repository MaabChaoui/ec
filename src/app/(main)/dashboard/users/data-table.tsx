/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { useAppSelector } from "@/store/store";       // instead of bare useSelector
import { Checkbox } from "@/components/ui/checkbox"; // shadcn checkbox
// import { assignDepartments, unassignDepartments } from "../../../store/features/usersSlice";
import { assignDepartments } from "../../../store/features/usersSlice";

import React, { useEffect, useState } from "react";
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

import { fetchUsers } from "../../../../store/features/usersSlice";
import { updateUserAction } from "../../../../actions/users/action";

import { User } from "../../../../lib/definitions";

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
    dispatch(
      fetchUsers({ page: newPage, perPage: 10, searchTerm: searchTerm }),
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // const [diagOpen, setDiagOpen] = useState(false);

  // **Initialize** with the user’s current values
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

  // departments list from the slice
  const allDepts = useSelector((state: any) => state.departments.departments);
  useEffect(() => {
    console.log("allDepts:", allDepts);
  }, [allDepts]);
  // Track the checkbox selection
  const [deptIds, setDeptIds] = useState<number[]>([]);

  const [selected, setSelected] = useState<User | null>(null);

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
                const user = row.original as User;
                // console.log("ROW:", row);
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setSelected(user);
                      setDeptIds(user.departmentIds);
                      setStatus(user.status);
                      setRole(user.role);
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

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="dark:bg-transparent backdrop-blur-lg">
            <DialogHeader className="flex justify-center">
              <DialogTitle className="flex justify-center">
                Edit User {selected?.name}
              </DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                formData.set("role", role);
                formData.set("status", status);
                formData.set("departments", JSON.stringify(deptIds));
                console.log("SUBMITTING FORM: ", { deptIds, status, role });
                try {
                  await updateUserAction(
                    selected ? [selected] : null,
                    formData,
                  );
                  // setDiagOpen(false);
                  setSelected(null);
                  dispatch(
                    fetchUsers({
                      page: 1,
                      perPage: 10,
                      searchTerm: "",
                    }),
                  );
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
                <Input type="hidden" name="id" value={selected?.id} />
                <Input
                  placeholder={selected?.id}
                  disabled
                  className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Created At</label>
                <Input
                  type="text"
                  placeholder={new Date(
                    selected?.created_at ?? "",
                  ).toLocaleString()}
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
                  defaultValue={selected?.name}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  defaultValue={selected?.email}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selected?.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="DEACTIVATED">DEACTIVATED</SelectItem>
                    <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selected?.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Departments
                </label>

                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {allDepts.map((dep) => {
                    const checked = deptIds.includes(dep.id);
                    return (
                      <div key={dep.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dep-${dep.id}`}
                          checked={checked}
                          onCheckedChange={(c: boolean) => {
                            setDeptIds((prev) =>
                              c
                                ? [...prev, dep.id]
                                : prev.filter((id) => id !== dep.id),
                            );
                          }}
                        />
                        <label htmlFor={`dep-${dep.id}`} className="text-sm">
                          {dep.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
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
                  onClick={() => {
                    setSelected(null);
                  }}
                >
                  Cancel
                </Button>
                {/* <Button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("selected: ", selected);
                    console.log("deptIds", deptIds);
                    console.log("status", status);
                    console.log("role", role);
                  }}
                >
                  log
                </Button> */}
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
