// components/SpeciesTableHeader.tsx
import React from 'react'
import { FiFilter, FiChevronDown } from 'react-icons/fi'
import { AiOutlineReload } from 'react-icons/ai'

type FilterKeys = 'date' | 'orderType' | 'orderStatus'

interface Props {
  filter: {
    date: string
    orderType: string
    orderStatus: string
  }
  onFilterChange: (key: FilterKeys, value: string) => void
  onReset: () => void
  onAdd: () => void
}

const SpeciesTableHeader: React.FC<Props> = ({
  filter,
  onFilterChange,
  onReset,
  onAdd,
}) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900">Species</h2>

      {/* Filter bar */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
        {/* Left: filters */}
        <div className="flex items-center space-x-3">
          {/* Filter By button */}
          <button
            className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
          >
            <FiFilter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter By</span>
          </button>

          {/* Date dropdown */}
          <div>
            <button
              className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => {} /* open your date picker */}
            >
              <span className="text-sm">{filter.date || 'Date'}</span>
              <FiChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Order Type dropdown */}
          <div>
            <button
              className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => {} /* open your type selector */}
            >
              <span className="text-sm">{filter.orderType || 'Order Type'}</span>
              <FiChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Order Status dropdown */}
          <div>
            <button
              className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => {} /* open your status selector */}
            >
              <span className="text-sm">{filter.orderStatus || 'Order Status'}</span>
              <FiChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Filter */}
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-red-500 hover:text-red-700 text-sm font-medium"
          >
            <AiOutlineReload className="w-4 h-4" />
            <span>Reset Filter</span>
          </button>
        </div>

        {/* Right: ADD button */}
        <button
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
        >
          ADD
        </button>
      </div>
    </div>
  )
}

export default SpeciesTableHeader
