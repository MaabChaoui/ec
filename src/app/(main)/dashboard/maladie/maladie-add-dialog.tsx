"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MaladieAddDialogProps {
  onMaladieCreated?: (maladie: any) => void;
}

export function MaladieAddDialog({ onMaladieCreated }: MaladieAddDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white h-10 px-8 font-medium">
          ADD
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Add New Maladie
          </DialogTitle>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            try {
              // Create maladie object from form data
              const newMaladie = {
                nom_maladie: formData.get("nom_maladie") as string,
                symptomes: formData.get("symptomes") as string,
                traitement: formData.get("traitement") as string,
                genre_id: parseInt(formData.get("genre_id") as string),
              };

              // TODO: Call your API to create the maladie
              // const result = await createMaladieAction(newMaladie);
              
              console.log("Creating maladie:", newMaladie);
              
              if (onMaladieCreated) {
                onMaladieCreated(newMaladie);
              }
              
              setOpen(false);
              
              // Reset form
              e.currentTarget.reset();
            } catch (err) {
              console.error("Error creating maladie:", err);
              // TODO: show error toast/notification
            }
          }}
        >
          {/* nom_maladie Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              nom_maladie
            </label>
            <Input
              name="nom_maladie"
              type="text"
              placeholder="Enter disease name"
              className="w-full"
              required
            />
          </div>

          {/* symptomes Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              symptomes
            </label>
            <Textarea
              name="symptomes"
              placeholder="Enter symptoms"
              className="w-full min-h-[80px] resize-none"
              required
            />
          </div>

          {/* traitement Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              traitement
            </label>
            <Textarea
              name="traitement"
              placeholder="Enter treatment"
              className="w-full min-h-[80px] resize-none"
              required
            />
          </div>

          {/* genre_id Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              genre_id
            </label>
            <Input
              name="genre_id"
              type="number"
              placeholder="Enter genre ID"
              className="w-full"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md font-medium"
            >
              Add Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}