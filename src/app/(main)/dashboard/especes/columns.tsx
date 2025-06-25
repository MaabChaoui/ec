"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, TreePine } from "lucide-react";
import Link from "next/link";

// Define the Species type based on your Genre table schema
export type Species = {
  id: number;
  genre: string; // This is the nom_scientifique from your design
  ordre: string;
  statut_conservation: string;
  description: string;
};

export const columns: ColumnDef<Species>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id: number = row.getValue("id");
      return <span className="font-mono text-sm">{String(id).padStart(5, '0')}</span>;
    },
  },
  {
    accessorKey: "genre",
    header: "Nom_scientifique",
  },
  {
    accessorKey: "ordre",
    header: "Ordre",
  },
  {
    accessorKey: "statut_conservation", 
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
      const species = row.original;
      // Create a URL-friendly slug from the species name
      const speciesSlug = species.genre?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'unknown';
      
      return (
        <div className="flex items-center gap-2">
          {/* View Pied button - navigates to /pied/[species-name] */}
          <Link href={`/dashboard/pied/${speciesSlug}`} passHref>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e:any)=>{e.stopPropagation()}}
              className="h-8 w-8 p-0 hover:bg-green-50"
              title={`View ${species.genre} plants`}
            >
              <TreePine className="h-4 w-4 text-green-600" />
            </Button>
          </Link>
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
