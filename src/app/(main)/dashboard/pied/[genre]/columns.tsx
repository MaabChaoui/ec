"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

// Define the Pied type based on your database schema
export type Pied = {
  id: number;
  genre_id: number;
  nom_commun: string;
  nom_scientifique_ancien?: string;
  nom_scientifique_nouveau?: string;
  famille?: string;
  origine?: string;
  type?: string;
  age?: string;
  exigences?: string;
  taux_croissance?: string;
  periode_floraison?: string;
  periode_fruitification?: string;
  multiplication?: string;
  maladie_id?: number;
  élagage?: string;
  utilisation?: string;
  caracteristique_feuillage?: string;
  cycle_vegetatif?: string;
  // Additional fields for display
  address?: string;
  date?: string;
  status?: string;
};

export const columns: ColumnDef<Pied>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id: number = row.getValue("id");
      return <span className="font-mono text-sm">{String(id).padStart(5, '0')}</span>;
    },
  },
  {
    accessorKey: "nom_commun",
    header: "NAME",
    cell: ({ row }) => {
      const name: string = row.getValue("nom_commun");
      return <span className="font-medium">{name}</span>;
    },
  },
  {
    accessorKey: "origine",
    header: "ADDRESS",
    cell: ({ row }) => {
      const address: string = row.getValue("origine") || "Not specified";
      return <span className="text-gray-600">{address}</span>;
    },
  },
  {
    accessorKey: "periode_floraison",
    header: "DATE",
    cell: ({ row }) => {
      const date: string = row.getValue("periode_floraison") || "N/A";
      return <span className="text-sm">{date}</span>;
    },
  },
  {
    accessorKey: "type",
    header: "TYPE",
    cell: ({ row }) => {
      const type: string = row.getValue("type") || "Unknown";
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {type}
        </span>
      );
    },
  },
//   {
//     accessorKey: "age",
//     header: "STATUS",
//     cell: ({ row }) => {
//       const status: string = row.getValue("age") || "Unknown";
//       const getStatusColor = (status: string) => {
//         switch (status.toLowerCase()) {
//           case "young":
//           case "jeune":
//             return "bg-green-100 text-green-800";
//           case "mature":
//             return "bg-blue-100 text-blue-800";
//           case "old":
//           case "ancien":
//             return "bg-yellow-100 text-yellow-800";
//           default:
//             return "bg-gray-100 text-gray-800";
//         }
//       };
      
//       return (
//         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
//           {status}
//         </span>
//       );
//     },
//   },
  {
    id: "action",
    header: "ACTION",
    cell: ({ row }) => {
      const pied = row.original;
      
      return (
        <div className="flex items-center gap-2">
          <Link href={`./fiche-technique/${pied.id}`} passHref>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e:any)=>{e.stopPropagation()}}
              className="h-8 w-8 p-0 hover:bg-blue-50"
              title="Voir fiche technique"
            >
              <ExternalLink className="h-4 w-4 text-blue-600" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];