// components/dashboard/UsersList.tsx
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { SquarePlus, FolderPlus } from "lucide-react";
import { createUserAction } from "../../actions/users/action";
import { createDepartmentAction } from "../../actions/departments/action";
import { useAppDispatch } from "../../store/store";
import { fetchDepartments } from "../../store/features/departmentsSlice";

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-row justify-between my-10">
      <div className="text-xl font-black">Departments Management</div>
      <div className="gap-4 flex">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <SquarePlus /> New Department
            </Button>
          </DialogTrigger>

          <DialogContent className="dark:bg-transparent  backdrop-blur-lg">
            <DialogHeader className="flex justify-center">
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                try {
                  const updated = await createDepartmentAction(users, formData);
                  setUsers(updated);
                  setOpen(false);
                  dispatch(fetchDepartments());
                } catch (err) {
                  console.error(err);
                  // TODO: show a toast/snackbar
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium">
                  Department Name
                </label>
                <Input name="name" type="text" className="mt-1 block w-full" />
              </div>

              <div className="flex justify-center gap-2 pt-10">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border"
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus /> Upload from File
            </Button>
          </DialogTrigger>{" "}
          <DialogContent className="dark:bg-transparent  backdrop-blur-lg">
            <DialogHeader className="flex align-center justify-center">
              <DialogTitle className="flex align-center justify-center">
                Coming Soon
              </DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
