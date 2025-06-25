"use client";

import { useState, useEffect } from "react";
import { SpeciesHeader } from "./species-header";
import { DataTable } from "./data-table";
import { columns, Species } from "./columns";

export default function SpeciesPage() {
  // Data state
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [dateFilter, setDateFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Fetch species from backend
  const fetchSpecies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/genres/');
      if (!response.ok) {
        throw new Error('Failed to fetch species');
      }
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setSpecies(data);
      } else if (data && Array.isArray(data.results)) {
        // Handle paginated response
        setSpecies(data.results);
      } else {
        console.error('Unexpected data format:', data);
        setSpecies([]);
      }
    } catch (error) {
      console.error('Error fetching species:', error);
      setSpecies([]); // Set empty array on error
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSpecies();
  }, []);

  // Create new species
  const handleSpeciesCreated = async (newSpeciesData: any) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/genres/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genre: newSpeciesData.nom_scientifique,
          ordre: newSpeciesData.ordre,
          statut_conservation: newSpeciesData.statut_conservation,
          description: newSpeciesData.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create species');
      }

      // Refresh the data
      await fetchSpecies();
    } catch (error) {
      console.error('Error creating species:', error);
      // TODO: Show error toast
    }
  };

  const handleResetFilters = () => {
    setDateFilter("all");
    setOrderTypeFilter("all");
    setOrderStatusFilter("all");
    setSearchTerm("");
  };

  // Apply filters to data
  const filteredSpecies = Array.isArray(species) ? species.filter((item) => {
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        item.genre?.toLowerCase().includes(searchLower) ||
        item.ordre?.toLowerCase().includes(searchLower) ||
        item.statut_conservation?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Apply other filters here if needed
    // For now, we'll just return true since the backend data doesn't have date/order info
    return true;
  }) : [];

  return (
    <div className="container mx-auto py-10">
      <SpeciesHeader
        onSpeciesCreated={handleSpeciesCreated}
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
          placeholder="Search species..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
        />
      </div>
      
      <DataTable
        columns={columns}
        data={filteredSpecies}
        isLoading={loading}
        searchTerm={searchTerm}
        onRefresh={fetchSpecies}
      />
    </div>
  );
}