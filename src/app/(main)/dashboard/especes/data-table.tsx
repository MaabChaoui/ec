/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationSuivant,
  PaginationPrécédent,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Species type matching your Genre table schema
export type Species = {
  id: number;
  genre: string; // nom_scientifique in your design
  ordre: string;
  statut_conservation: string;
  description: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  searchTerm?: string;
  onRefresh?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  searchTerm = "",
  onRefresh,
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Species | null>(null);
  
  // Form states for editing
  const [editGenre, setEditGenre] = useState("");
  const [editOrdre, setEditOrdre] = useState("");
  const [editStatutConservation, setEditStatutConservation] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const itemsPerPage = 10;

  // Calculate pagination
  useEffect(() => {
    const totalItems = data.length;
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [data]);

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter((item: any) => {
      const species = item as Species;
      return (
        species.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.ordre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.statut_conservation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm]);

  // Paginate filtered data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Update species function
  const updateSpecies = async (updatedSpecies: Species) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/genres/${updatedSpecies.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genre: editGenre,
          ordre: editOrdre,
          statut_conservation: editStatutConservation,
          description: editDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update species');
      }

      // Close dialog and refresh data
      setSelected(null);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating species:', error);
      // TODO: Show error toast
    }
  };

  // Delete species function
  const deleteSpecies = async (speciesId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/genres/${speciesId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete species');
      }

      // Close dialog and refresh data
      setSelected(null);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting species:', error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="rounded-md border min-h-[400px] flex flex-col">
      <div className="flex-1 overflow-auto bg-white">
        <Table>
          <TableHeader className="bg-sidebar">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array(10)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={`skeleton-cell-${index}-${colIndex}`}>
                        <Skeleton className="h-4 w-[80%]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const species = row.original as Species;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setSelected(species);
                      // Initialize edit form with current values
                      setEditGenre(species.genre || "");
                      setEditOrdre(species.ordre || "");
                      setEditStatutConservation(species.statut_conservation || "");
                      setEditDescription(species.description || "");
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Pas de résultats.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination area */}
      <div className="p-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}-{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
          </div>
          <div className="flex justify-center items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrécédent
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isLoading) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <span className="mx-2">of {totalPages}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationSuivant
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isLoading) handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages || isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      {/* Edit Species Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="dark:bg-transparent backdrop-blur-lg max-w-md">
            <DialogHeader className="flex justify-center">
              <DialogTitle className="flex justify-center">
                Edit Species {selected?.genre}
              </DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (selected) {
                  await updateSpecies(selected);
                }
              }}
            >
              {/* ID (Read-only) */}
              <div>
                <label className="block text-sm font-medium">ID</label>
                <Input
                  placeholder={selected?.id.toString()}
                  disabled
                  className="mt-1 block w-full border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <Separator />

              {/* Genre (nom_scientifique) */}
              <div>
                <label className="block text-sm font-medium">Nom Scientifique</label>
                <Input
                  type="text"
                  value={editGenre}
                  onChange={(e) => setEditGenre(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Ordre */}
              <div>
                <label className="block text-sm font-medium">Ordre</label>
                <Input
                  type="text"
                  value={editOrdre}
                  onChange={(e) => setEditOrdre(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Statut de conservation */}
              <div>
                <label className="block text-sm font-medium">Statut de Conservation</label>
                <Input
                  type="text"
                  value={editStatutConservation}
                  onChange={(e) => setEditStatutConservation(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md min-h-[100px]"
                  required
                />
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex justify-between gap-2 pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (selected && confirm('Are you sure you want to delete this species?')) {
                      deleteSpecies(selected.id);
                    }
                  }}
                  className="px-4 py-2"
                >
                  Delete
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelected(null)}
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-4 py-2">
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}