"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../../../lib/definitions";
import { formatDate } from "../../../../lib/utils";

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
  {
    accessorKey: "docs_count",
    header: "Documents Count",
  },
];
