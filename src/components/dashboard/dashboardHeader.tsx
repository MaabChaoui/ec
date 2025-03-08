// components/dashboard/UsersList.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import { useAppDispatch, useAppSelector } from "../../store/store";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { SquarePlus, FolderPlus } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex flex-row justify-between my-10">
      <div className="text-xl font-black">User Management</div>
      <div className="gap-4 flex">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="">
              <SquarePlus />
              New User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-transparent backdrop-blur-lg">
            <DialogHeader className="flex justify-center">
              <DialogTitle className="flex justify-center">
                Create New User
              </DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                // Implement your save logic here.
              }}
            >
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="mb-6">
                <label className="block text-sm font-medium">Password</label>
                <Input
                  type="password"
                  className="mt-1 block w-full border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-center gap-2 pt-10">
                <Button
                  type="button"
                  className="px-4 py-2 rounded bg-background text-foreground border hover:bg-gray-100 hover:text-gray-700"
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-4 py-2">
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Button className="">
          <FolderPlus />
          Upload from File
        </Button>
      </div>
    </div>
  );
}
