/* eslint-disable @typescript-eslint/no-unused-vars */
// components/documents/DocumentColumns.tsx
"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Document } from "@/lib/features/documents/documentTypes";
import {
  File,
  FileChartColumnIncreasing,
  FileText,
  Folder,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { User } from "../../../../lib/definitions";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../../../components/ui/hover-card";
import { getUserAction } from "../../../../actions/users/getUserAction";
import { formatContentType } from "../../../../lib/utils";
import { getFileIcon } from "../../../../lib/icons";

function UserHoverCard({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = async (o: boolean) => {
    setOpen(o);
    if (o && !user && !loading) {
      setLoading(true);
      try {
        const u = await getUserAction(email);
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <HoverCard open={open} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <span className="text-blue-600 underline cursor-pointer">{email}</span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          <div className="space-y-1 text-sm">
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Role:</strong> {user.role}
            </div>
            <div>
              <strong>Status:</strong> {user.status}
            </div>
            <div>
              <strong>Departments:</strong> {user.departmentIds.join(", ")}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No info</div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

export const columns: ColumnDef<Document>[] = [
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const document = row.original;
      const extension = formatContentType(document.type); // like 'csv', 'pdf', etc.

      return (
        <div className="flex items-center gap-2">
          {getFileIcon(extension)}
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
      return document.type ? formatContentType(document.type) : "-";
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const document = row.original;
      return document.size ? formatBytes(document.size || 0) : "-";
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "department",
    header: "Department",
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
    accessorKey: "createdBy",
    header: "Creator",
    cell: ({ getValue }) => <UserHoverCard email={getValue<string>()} />,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "downloadUrl",
    header: "Download",
    cell: ({ row }) => {
      // cell: ({ getValue }) => {
      const url = row.original.downloadUrl;
      // const url = getValue<string>();

      const handleDownload = async () => {
        console.log("row.original ", row.original);
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
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="inline-flex p-1 hover:bg-muted rounded"
        >
          <Download className="h-5 w-5 text-blue-600" />
        </button>
      );
    },
  },
];
