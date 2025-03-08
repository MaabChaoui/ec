// app/dashboard/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/store/store";
// import { AppDispatch, RootState } from "../../lib/store";
import { fetchUsers } from "../../../store/features/usersSlice";
import { setSearchTerm } from "../../../store/features/usersSlice";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import DashboardHeader from "../../../components/dashboard/dashboardHeader";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import SearchIcon from "../../../components/ui/searchIcon";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { Search } from "lucide-react";

export default function DemoPage() {
  const dispatch = useAppDispatch();
  const { users, loading, error, currentPage, totalPages, searchTerm } =
    useAppSelector((state) => state.users);

  const perPage = 5;
  const [localSearch, setLocalSearch] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Debounce search input
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [localSearch, dispatch]);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, perPage: 5, searchTerm: searchTerm }));
  }, [dispatch, searchTerm]);

  const data = [];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  return (
    <div className="container mx-auto py-10">
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
      <DataTable
        columns={columns}
        data={users}
        isLoading={loading} // Pass loading state
      />
    </div>
  );
}
