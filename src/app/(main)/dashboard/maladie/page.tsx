"use client";

import { useState, useEffect } from "react";
import { MaladieHeader } from "./maladie-header";
import { DataTable } from "./data-table";
import { columns, Maladie } from "./columns";

export default function MaladiePage() {
  // Data state
  const [maladies, setMaladies] = useState<Maladie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter states
  const [dateFilter, setDateFilter] = useState("all");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Fetch maladies from backend
  const fetchMaladies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/maladies/');
      if (!response.ok) {
        throw new Error('Failed to fetch maladies');
      }
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setMaladies(data);
      } else if (data && Array.isArray(data.results)) {
        // Handle paginated response
        setMaladies(data.results);
      } else {
        console.error('Unexpected data format:', data);
        setMaladies([]);
      }
    } catch (error) {
      console.error('Error fetching maladies:', error);
      setMaladies([]); // Set empty array on error
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMaladies();
  }, []);

  // Create new maladie
  const handleMaladieCreated = async (newMaladieData: any) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/maladies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom_maladie: newMaladieData.nom_maladie,
          symptomes: newMaladieData.symptomes,
          traitement: newMaladieData.traitement,
          genre_id: newMaladieData.genre_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create maladie');
      }

      // Refresh the data
      await fetchMaladies();
    } catch (error) {
      console.error('Error creating maladie:', error);
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
  const filteredMaladies = Array.isArray(maladies) ? maladies.filter((item) => {
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        item.nom_maladie?.toLowerCase().includes(searchLower) ||
        item.symptomes?.toLowerCase().includes(searchLower) ||
        item.traitement?.toLowerCase().includes(searchLower) ||
        item.genre_id?.toString().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Apply other filters here if needed
    // For now, we'll just return true since the backend data doesn't have date/order info
    return true;
  }) : [];

  return (
    <div className="container mx-auto py-10">
      <MaladieHeader
        onMaladieCreated={handleMaladieCreated}
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
          placeholder="Search maladies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
        />
      </div>
      
      <DataTable
        columns={columns}
        data={filteredMaladies}
        isLoading={loading}
        searchTerm={searchTerm}
        onRefresh={fetchMaladies}
      />
    </div>
  );
}