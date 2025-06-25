"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PiedHeader } from "./pied-header";
import { DataTable } from "./data-table";
import { columns, Pied } from "./columns";

export default function PiedPage() {
  const params = useParams();
  const genreSlug = params.genre as string;

  // Data state
  const [pieds, setPieds] = useState<Pied[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreId, setGenreId] = useState<number | undefined>();

  // Filter states
  const [dateFilter, setDateFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  const [notFound, setNotFound] = useState("");
  // Fetch pieds from backend for this specific genre
  const fetchPieds = async () => {
    if (!genreSlug) return;

    setLoading(true);
    try {
      console.log(genreSlug);
      const response = await fetch(
        `http://127.0.0.1:8000/api/pieds/genre/${genreSlug}`
      );
      if (!response.ok) {
        setNotFound(`Genre ${genreSlug} Pas trouvé!`);
        throw new Error("Failed to fetch pieds");
      }
      const data = await response.json();

      // Ensure data is an array
      if (Array.isArray(data)) {
        setPieds(data);
        // Extract genre_id from first item if available
        if (data.length > 0 && data[0].genre_id) {
          setGenreId(data[0].genre_id);
        }
      } else if (data && Array.isArray(data.results)) {
        // Handle paginated response
        setPieds(data.results);
        if (data.results.length > 0 && data.results[0].genre_id) {
          setGenreId(data.results[0].genre_id);
        }
      } else {
        console.error("Unexpected data format:", data);
        setPieds([]);
      }
    } catch (error) {
      console.error("Error fetching pieds:", error);
      setPieds([]); // Set empty array on error
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch when genre changes
  useEffect(() => {
    fetchPieds();
  }, [genreSlug]);

  const handleResetFilters = () => {
    setDateFilter("all");
    setOrderTypeFilter("all");
    setOrderStatusFilter("all");
    setSearchTerm("");
  };

  // Create new pied
  const handlePiedCreated = async (newPiedData: any) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/pieds/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPiedData),
      });

      if (!response.ok) {
        throw new Error("Failed to create pied");
      }

      // Refresh the data
      await fetchPieds();
    } catch (error) {
      console.error("Error creating pied:", error);
      // TODO: Show error toast
    }
  };

  // Apply filters to data
  const filteredPieds = Array.isArray(pieds)
    ? pieds.filter((item) => {
        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch =
            item.nom_commun?.toLowerCase().includes(searchLower) ||
            item.origine?.toLowerCase().includes(searchLower) ||
            item.type?.toLowerCase().includes(searchLower) ||
            item.famille?.toLowerCase().includes(searchLower);

          if (!matchesSearch) return false;
        }

        // Apply type filter
        if (orderTypeFilter !== "all") {
          if (item.type?.toLowerCase() !== orderTypeFilter.toLowerCase()) {
            return false;
          }
        }

        // Apply status filter (using age field as status)
        if (orderStatusFilter !== "all") {
          if (item.age?.toLowerCase() !== orderStatusFilter.toLowerCase()) {
            return false;
          }
        }

        // Date filter could be applied to periode_floraison or any date field
        // For now, we'll just return true since we don't have specific date filtering logic
        return true;
      })
    : [];

  if (!genreSlug) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {notFound ? (
        <>
          <h1 className="text-3xl m-8 text-red-500 font-semibold text-gray-900 mb-8">
            {notFound}
          </h1>
        </>
      ) : (
        <div className="container mx-auto py-10">
          <PiedHeader
            genreSlug={genreSlug}
            genreId={genreId}
            onPiedCreated={handlePiedCreated}
            onResetFilters={handleResetFilters}
            dateFilter={dateFilter}
            orderTypeFilter={orderTypeFilter}
            orderStatusFilter={orderStatusFilter}
            onDateFilterChange={setDateFilter}
            onOrderTypeFilterChange={setOrderTypeFilter}
            onOrderStatusFilterChange={setOrderStatusFilter}
          />

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search pieds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
            />
          </div>
        </div>
      )}
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={filteredPieds}
          isLoading={loading}
          searchTerm={searchTerm}
          onRefresh={fetchPieds}
        />
      </div>
    </>
  );
}
