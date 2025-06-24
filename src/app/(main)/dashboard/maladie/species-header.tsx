import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw, ChevronDown } from "lucide-react";
import { SpeciesAddDialog } from "./species-add-dialog";

interface SpeciesHeaderProps {
  onSpeciesCreated?: (species: any) => void;
  onResetFilters?: () => void;
  // Filter state props
  dateFilter: string;
  orderTypeFilter: string;
  orderStatusFilter: string;
  onDateFilterChange: (value: string) => void;
  onOrderTypeFilterChange: (value: string) => void;
  onOrderStatusFilterChange: (value: string) => void;
}

export function SpeciesHeader({
  onSpeciesCreated,
  onResetFilters,
  dateFilter,
  orderTypeFilter,
  orderStatusFilter,
  onDateFilterChange,
  onOrderTypeFilterChange,
  onOrderStatusFilterChange,
}: SpeciesHeaderProps) {
  return (
    <div className="mb-8">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Maladie</h1>
      
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
              <SelectTrigger className="w-[100px] h-10 bg-white border-gray-200 text-sm">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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

        {/* Right side - Ajouter Dialog */}
        <SpeciesAddDialog onSpeciesCreated={onSpeciesCreated} />
      </div>
    </div>
  );
}