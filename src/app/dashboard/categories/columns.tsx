"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { User } from "../../../lib/definitions";
import { formatDate } from "../../../lib/utils";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: "Creation Date",
    cell: ({ row }) => {
      const value: string = row.getValue("createdAt");
      return formatDate(value);
    },
  },
  //TODO: add counts per category
];
