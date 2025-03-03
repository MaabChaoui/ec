// components/dashboard/UsersList.tsx
"use client";
import React from "react";
// import { useAppDispatch, useAppSelector } from "../../store/store";
import { Button } from "../ui/button";
import { SquarePlus, FolderPlus } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex flex-row justify-between my-10">
      <div className="text-xl font-black">User Management</div>
      <div className="gap-4 flex">
        <Button className="">
          <SquarePlus />
          New User
        </Button>
        <Button className="">
          <FolderPlus />
          Upload from File
        </Button>
      </div>
    </div>
  );
}
