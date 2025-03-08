// components/documents/DocumentColumns.tsx
"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Document } from "@/lib/features/documents/documentTypes";
import { File, Folder } from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="flex items-center gap-2">
          {document.type === "folder" ? (
            <Folder className="h-5 w-5 text-yellow-500" />
          ) : (
            <File className="h-5 w-5 text-blue-500" />
          )}
          <span className="font-medium">{document.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const document = row.original;
      return document.type === "folder"
        ? "Folder"
        : document.fileType?.toUpperCase();
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const document = row.original;
      return document.type === "file" ? formatBytes(document.size || 0) : "-";
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const document = row.original;
      return document.type === "folder" ? `${document.items} items` : "-";
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Modified",
    cell: ({ row }) => formatDate(row.getValue("updatedAt")),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            More
          </Button>
        </div>
      );
    },
  },
];
