"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";

// Define the Species type based on your Figma design
export type Species = {
  id: string;
  nom_scientifique: string;
  ordre: string;
  stat_conservation: string;
  description: string;
};

export const columns: ColumnDef<Species>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id: string = row.getValue("id");
      return <span className="font-mono text-sm">{id}</span>;
    },
  },
  {
    accessorKey: "nom_scientifique",
    header: "Nom_scientifique",
  },
  {
    accessorKey: "ordre",
    header: "Ordre",
  },
  {
    accessorKey: "stat_conservation", 
    header: "Stat-Consr",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "action",
    header: "ACTION",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ExternalLink className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];