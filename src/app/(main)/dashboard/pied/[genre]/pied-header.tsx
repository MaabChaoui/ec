import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw } from "lucide-react";
import { PiedAddDialog } from "./pied-add-dialog";

interface PiedHeaderProps {
  genreSlug: string;
  genreId?: number;
  onPiedCreated?: (pied: any) => void;
  onResetFilters?: () => void;
  // Filter state props
  dateFilter: string;
  orderTypeFilter: string;
  orderStatusFilter: string;
  onDateFilterChange: (value: string) => void;
  onOrderTypeFilterChange: (value: string) => void;
  onOrderStatusFilterChange: (value: string) => void;
}

export function PiedHeader({
  genreSlug,
  genreId,
  onPiedCreated,
  onResetFilters,
  dateFilter,
  orderTypeFilter,
  orderStatusFilter,
  onDateFilterChange,
  onOrderTypeFilterChange,
  onOrderStatusFilterChange,
}: PiedHeaderProps) {
  // Convert slug back to readable name
  const genreName = genreSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="mb-8">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">{genreName}</h1>
      
      {/* Filter Controls Row - matches the gray background container in the image */}
      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
        {/* Left side - Filter controls */}
        <div className="flex items-center gap-6">
          {/* Filter icon and Filter By text */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md border">
              <Filter className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Filter By</span>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger className="w-[120px] h-10 bg-white border-gray-200 text-sm">
                <SelectValue placeholder="14 Feb 2019" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Type Filter */}
          <div className="relative">
            <Select value={orderTypeFilter} onValueChange={onOrderTypeFilterChange}>
              <SelectTrigger className="w-[120px] h-10 bg-white border-gray-200 text-sm">
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="watch">Watch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Status Filter */}
          <div className="relative">
            <Select value={orderStatusFilter} onValueChange={onOrderStatusFilterChange}>
              <SelectTrigger className="w-[130px] h-10 bg-white border-gray-200 text-sm">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="young">Young</SelectItem>
                <SelectItem value="mature">Mature</SelectItem>
                <SelectItem value="old">Old</SelectItem>
                <SelectItem value="flowering">Flowering</SelectItem>
                <SelectItem value="dormant">Dormant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filter Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10 px-4 bg-white border border-gray-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Filter
          </Button>
        </div>

        {/* Right side - Add new pied button */}
        <PiedAddDialog genreId={genreId} onPiedCreated={onPiedCreated} />
      </div>
    </div>
  );
}