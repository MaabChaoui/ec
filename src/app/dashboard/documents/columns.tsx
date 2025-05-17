// components/documents/DocumentColumns.tsx
"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Document } from "@/lib/features/documents/documentTypes";
import { File, Folder } from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const columns: ColumnDef<Document>[] = [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="flex items-center gap-2">
          {document.type === "folder" ? (
            <Folder className="h-5 w-5 text-yellow-500" />
          ) : (
            <File className="h-5 w-5 text-blue-500" />
          )}
          <span className="font-medium">{document.title}</span>
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
        : (document.fileType?.toUpperCase() ?? "-");
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
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "creationDate",
    header: "Creation Date",
    cell: ({ row }) => {
      const value: string = row.getValue("creationDate");
      return formatDate(value);
    },
  },
  {
    accessorKey: "createdBy",
    header: "Creator",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "downloadUrl",
    header: "Download",
    cell: ({ getValue }) => {
      const url = getValue<string>();
      const handleDownload = async () => {
        const res = await fetch(url);
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        // derive a sensible filename from the URL
        const parts = url.split("/").pop()?.split("?")[0];
        a.download = parts ?? "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      return (
        <button
          onClick={handleDownload}
          className="inline-flex p-1 hover:bg-muted rounded"
        >
          <Download className="h-5 w-5 text-blue-600" />
        </button>
      );
    },
  },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Last Modified",
  //   cell: ({ row }) => formatDate(row.getValue("updatedAt")),
  // },
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
