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

interface PiedAddDialogProps {
  genreId?: number;
  onPiedCreated?: (pied: any) => void;
}

export function PiedAddDialog({ genreId, onPiedCreated }: PiedAddDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white h-10 px-8 font-medium">
          Ajouter un nouveau pied
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Ajouter un nouveau pied
          </DialogTitle>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            try {
              // Create pied object from form data
              const newPied = {
                genre_id: genreId || parseInt(formData.get("genre_id") as string),
                nom_commun: formData.get("nom_commun") as string,
                nom_scientifique_ancien: formData.get("nom_scientifique_ancien") as string,
                nom_scientifique_nouveau: formData.get("nom_scientifique_nouveau") as string,
                famille: formData.get("famille") as string,
                origine: formData.get("origine") as string,
                type: formData.get("type") as string,
                age: formData.get("age") as string,
                exigences: formData.get("exigences") as string,
              };

              // TODO: Call your API to create the pied
              // const result = await createPiedAction(newPied);
              
              console.log("Creating pied:", newPied);
              
              if (onPiedCreated) {
                onPiedCreated(newPied);
              }
              
              setOpen(false);
              
              // Reset form
              e.currentTarget.reset();
            } catch (err) {
              console.error("Error creating pied:", err);
              // TODO: show error toast/notification
            }
          }}
        >
          {/* nom_commun Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nom Commun
            </label>
            <Input
              name="nom_commun"
              type="text"
              placeholder="Enter common name"
              className="w-full"
              required
            />
          </div>

          {/* nom_scientifique_ancien Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nom Scientifique Ancien
            </label>
            <Input
              name="nom_scientifique_ancien"
              type="text"
              placeholder="Enter old scientific name"
              className="w-full"
            />
          </div>

          {/* nom_scientifique_nouveau Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nom Scientifique Nouveau
            </label>
            <Input
              name="nom_scientifique_nouveau"
              type="text"
              placeholder="Enter new scientific name"
              className="w-full"
            />
          </div>

          {/* famille Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Famille
            </label>
            <Input
              name="famille"
              type="text"
              placeholder="Enter family"
              className="w-full"
            />
          </div>

          {/* origine Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Origine
            </label>
            <Input
              name="origine"
              type="text"
              placeholder="Enter origin/address"
              className="w-full"
            />
          </div>

          {/* type Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <Input
              name="type"
              type="text"
              placeholder="Enter type"
              className="w-full"
            />
          </div>

          {/* age Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <Input
              name="age"
              type="text"
              placeholder="Enter age (Young, Mature, Old)"
              className="w-full"
            />
          </div>

          {/* exigences Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exigences
            </label>
            <Textarea
              name="exigences"
              placeholder="Enter requirements"
              className="w-full min-h-[80px] resize-none"
            />
          </div>

          {/* genre_id Field (if not provided as prop) */}
          {!genreId && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Genre ID
              </label>
              <Input
                name="genre_id"
                type="number"
                placeholder="Enter genre ID"
                className="w-full"
                required
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md font-medium"
            >
              Ajouter Maintenant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}