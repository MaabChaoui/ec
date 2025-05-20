// app/dashboard/documents/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchDocuments } from "@/store/features/documentsSlice";

import { DataTable } from "./documents-table";
import { columns } from "./columns";
import DashboardHeader from "../../../../components/dashboard/dashboardDocumentsHeader";

import { Skeleton } from "@/components/ui/skeleton";

import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { Search } from "lucide-react";
import { setSearchTerm } from "../../../../store/features/documentsSlice";

export default function DocumentsPage() {
  /* ------------------------------------------------------------------ */
  /*  Redux hooks and state                                                 */
  /* ------------------------------------------------------------------ */
  const dispatch = useAppDispatch();
  const { documents, loading, error, currentPage, totalPages, searchTerm } =
    useAppSelector((s) => s.documents);

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const perPage = 10;
  const [localSearch, setLocalSearch] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Debounce search input
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
    }, 500);

    console.log(searchTerm);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [localSearch, dispatch]);

  /* ------------------------------------------------------------------ */
  /*  Fetch once on mount                                                */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    dispatch(
      fetchDocuments({ page: 1, perPage: perPage, searchTerm: searchTerm }),
    );
  }, [dispatch, searchTerm]);

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div className="container mx-auto py-10">
      {/* -------- header bar -------- */}
      <DashboardHeader />
      {/* Search Bar Container */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <Search className="h-5 w-5" />
        </button>

        <div
          className={`
          relative overflow-hidden
          transition-all duration-300 ease-in-out
          ${isSearchVisible ? "max-w-sm opacity-100" : "max-w-0 opacity-0"}
        `}
        >
          <div className="flex items-center w-full space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-sidebar">
            <Input
              type="search"
              placeholder="Search"
              className="w-full border-0 h-8 font-semibold"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => {
            setIsFiltersVisible(!isFiltersVisible);
          }}
          className="hover:bg-accent rounded-full p-2"
        >
          <Filter className="h-5 w-5"></Filter>
        </button>
        <div
          className={`
          relative overflow-hidden
          transition-all duration-300 ease-in-out
          ${isFiltersVisible ? "max-w-sm opacity-100" : "max-w-0 opacity-0"}
        `}
        >
          <div className="italic w-30 gap-2 flex-row flex">
            <div className="w-[50px] bg-accent h-2 rounded-full"></div>
            <div className="w-[20px] bg-accent h-2 rounded-full"></div>
            <div className="w-[60px] bg-accent h-2 rounded-full"></div>
            <div className="w-[90px] bg-accent h-2 rounded-full"></div>
            <div className="w-[50px] bg-accent h-2 rounded-full"></div>
          </div>
        </div>
      </div>
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
        <DataTable columns={columns} data={documents} isLoading={loading} />
      )}
    </div>
  );
}
