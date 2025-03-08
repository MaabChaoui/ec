// app/dashboard/documents/page.tsx
"use client";
import React from "react";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchDocuments,
  navigateToFolder,
} from "@/store/features/documentsSlice";
import { DataTable } from "./documents-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

export default function DocumentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, loading, error, currentFolder } = useSelector(
    (state: RootState) => state.documents,
  );

  useEffect(() => {
    dispatch(fetchDocuments(currentFolder));
  }, [currentFolder, dispatch]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Documents</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </div>

        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => dispatch(navigateToFolder(null))}
              className={`p-2 m-2 ${currentFolder ? "hover:cursor-pointer hover:bg-accent" : ""} rounded-xl`}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          {currentFolder && (
            <BreadcrumbItem>
              <BreadcrumbLink>Current Folder</BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </Breadcrumb>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <DataTable
          columns={columns}
          data={documents}
          onRowClick={(document) => {
            if (document.type === "folder") {
              dispatch(navigateToFolder(document.id));
            }
          }}
          className="cursor-pointer"
        />
      )}
    </div>
  );
}
