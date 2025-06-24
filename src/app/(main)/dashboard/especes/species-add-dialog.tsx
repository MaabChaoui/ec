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
import { Plus } from "lucide-react";

interface SpeciesAddDialogProps {
  onSpeciesCreated?: (species: any) => void;
}

export function SpeciesAddDialog({ onSpeciesCreated }: SpeciesAddDialogProps) {
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
            Add New Species
          </DialogTitle>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            try {
              // Create species object from form data
              const newSpecies = {
                nom_scientifique: formData.get("nom_scientifique") as string,
                ordre: formData.get("ordre") as string,
                statut_conservation: formData.get("statut_conservation") as string,
                description: formData.get("description") as string,
              };

              // TODO: Call your API to create the species
              // const result = await createSpeciesAction(newSpecies);
              
              console.log("Creating species:", newSpecies);
              
              if (onSpeciesCreated) {
                onSpeciesCreated(newSpecies);
              }
              
              setOpen(false);
              
              // Reset form
              e.currentTarget.reset();
            } catch (err) {
              console.error("Error creating species:", err);
              // TODO: show error toast/notification
            }
          }}
        >
          {/* Nom_scientifique Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nom_scientifique
            </label>
            <Input
              name="nom_scientifique"
              type="text"
              placeholder="Enter scientific name"
              className="w-full"
              required
            />
          </div>

          {/* Ordre Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ordre
            </label>
            <Input
              name="ordre"
              type="text"
              placeholder="Enter order"
              className="w-full"
              required
            />
          </div>

          {/* Statut de conservation Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Statut de conservation
            </label>
            <Input
              name="statut_conservation"
              type="text"
              placeholder="Enter conservation status"
              className="w-full"
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              name="description"
              placeholder="Enter description"
              className="w-full min-h-[100px] resize-none"
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