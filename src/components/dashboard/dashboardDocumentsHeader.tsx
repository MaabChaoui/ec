/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/UsersList.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { SquarePlus, FolderPlus } from "lucide-react";
import { createCategoryAction } from "../../actions/categories/action";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchCategories } from "../../store/features/categoriesSlice";
import { fetchDocuments } from "../../store/features/documentsSlice";
import { createDocumentAction } from "../../actions/documents/action";
import { fetchDepartments } from "../../store/features/departmentsSlice";

export default function UsersList() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { categories, cat_loading, cat_error } = useAppSelector(
    (state) => state.categories,
  );

  const { departments, dep_loading, dep_error } = useAppSelector(
    (state) => state.departments,
  );
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <div className="flex flex-row justify-between my-10">
      <div className="text-xl font-black">Documents Management</div>
      <div className="gap-4 flex">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <SquarePlus /> New Document
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-transparent backdrop-blur-lg">
            <DialogHeader className="flex justify-center">
              <DialogTitle>Create New Document</DialogTitle>
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);

                try {
                  console.log("createDocumentAction...");
                  const updated = await createDocumentAction(documents, fd);

                  setDocuments(updated); // optimistic
                  setOpen(false);
                  dispatch(fetchDocuments()); // sync slice
                } catch (err) {
                  console.error(err);
                  // TODO: toast
                }
              }}
            >
              {/* title */}
              <div>
                <label className="block text-sm font-medium">Title</label>
                <Input name="title" type="text" className="mt-1 w-full" />
              </div>

              {/* category */}
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  name="categoryId"
                  className="mt-1 w-full border rounded-md p-2 bg-background"
                  required
                >
                  {!cat_loading && !!categories
                    ? categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    : "Loading categories..."}
                </select>
              </div>

              {/* department */}
              <div>
                <label className="block text-sm font-medium">Department</label>
                <select
                  name="departmentId"
                  className="mt-1 w-full border rounded-md p-2 bg-background"
                  required
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* file */}
              <div>
                <label className="block text-sm font-medium">
                  File (PDF, etc.)
                </label>
                <Input
                  name="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="mt-1 block w-full"
                  required
                />
              </div>

              {/* buttons */}
              <div className="flex justify-center gap-2 pt-8">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
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
          <DialogContent className="bg-transparent backdrop-blur-lg">
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
