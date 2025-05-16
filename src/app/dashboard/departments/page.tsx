// app/dashboard/departments/page.tsx
"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchDepartments } from "../../../store/features/departmentsSlice";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import DashboardHeader from "../../../components/dashboard/dashboardDepartmentsHeader";

export default function DepartmentsPage() {
  const dispatch = useAppDispatch();
  const { departments, loading, error } = useAppSelector(
    (state) => state.departments,
  );

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-10">
      <DashboardHeader />
      {error && (
        <div className="text-red-500 mb-4">
          Failed to load departments: {error}
        </div>
      )}
      <DataTable columns={columns} data={departments} isLoading={loading} />
    </div>
  );
}
