"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { User } from "../../../../lib/definitions";
import { formatDate } from "../../../../lib/utils";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "created_at",
    header: "Join Date",
    cell: ({ row }) => {
      const value: string = row.getValue("created_at");
      return formatDate(value);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  // {
  //   accessorKey: "departmentIds",
  //   header: "Deps",
  // },
];
