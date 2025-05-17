// app/dashboard/documents/page.tsx
"use client";

import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchDocuments } from "@/store/features/documentsSlice";

import { DataTable } from "./documents-table";
import { columns } from "./columns";
import DashboardHeader from "../../../components/dashboard/dashboardDocumentsHeader";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentsPage() {
  /* ------------------------------------------------------------------ */
  /*  Redux hooks                                                        */
  /* ------------------------------------------------------------------ */
  const dispatch = useAppDispatch();
  const { documents, loading, error } = useAppSelector((s) => s.documents);

  /* ------------------------------------------------------------------ */
  /*  Fetch once on mount                                                */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div className="container mx-auto py-10">
      {/* -------- header bar -------- */}
      <DashboardHeader />

      {/* -------- main content -------- */}
      {loading ? (
        /* skeleton list */
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[180px]" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* error state */
        <div className="text-red-500 text-center py-8">
          Failed to load Documents: {error}
        </div>
      ) : (
        /* table */
        <DataTable columns={columns} data={documents} />
      )}
    </div>
  );
}
