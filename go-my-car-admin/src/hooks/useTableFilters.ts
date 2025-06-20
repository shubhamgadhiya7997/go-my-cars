import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

export interface Filter {
  col_key: string;
  filedType: 'input' | 'select';
  queryKey: string;
  placeHolder: string;
  defaultLabelValue?: string;
  options?: { label: string; value: string | boolean }[];
}

/**
 * Custom hook for managing filter state and operations
 * @param {Array} initialFilters - Array of filter configurations
 * @param {Object} initialPagination - Initial pagination state
 * @param {Function} onPaginationChange - Callback for pagination updates
 * @param {Number} debounceTime - Debounce time in milliseconds for search changes
 * @returns {Object} Filter state and handler functions
 */
export const useTableFilters = (
  initialFilters: Filter[] = [],
  initialPagination = { page: 1 },
  onPaginationChange = (pagination: any) => {},
  debounceTime = 500
) => {
  // Initialize search state
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Initialize search query parameters
  const [searchQueryParams, setSearchQueryParams] = useState<{ [key: string]: any }>({});
  
  // Initialize selected filter values based on filter types
  const [selectedFilterValues, setSelectedFilterValues] = useState(
    initialFilters.reduce((acc: { [key: string]: string }, filter) => {
      if (filter.filedType === 'select') {
        acc[filter.col_key] = 'All';
      }
      return acc;
    }, {})
  );
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      // Reset to page 1 when search changes
      onPaginationChange({
        ...initialPagination,
        page: 1,
      });
    }, debounceTime),
    [initialPagination, onPaginationChange]
  );
  
  // Handle search input changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  }, [debouncedSearch]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((filteredValues: Filter, value: string) => {
    // Update selected filter values
    setSelectedFilterValues((prev) => ({
      ...prev,
      [filteredValues.col_key]: value,
    }));
    
    // Update search query parameters
    if (
      (filteredValues.filedType === 'select' && value === 'All') ||
      (filteredValues.filedType === 'input' && value === '')
    ) {
      // Remove the parameter if it's set to default/empty
      setSearchQueryParams((prev) => {
        const { [filteredValues.queryKey]: _, ...newParams } = prev;
        return newParams;
      });
    } else {
      // Add or update the parameter
      setSearchQueryParams((prev) => ({
        ...prev,
        [filteredValues.queryKey]: value,
      }));
    }
    
    // Reset to page 1 when filters change
    onPaginationChange({
      ...initialPagination,
      page: 1,
    });
  }, [initialPagination, onPaginationChange]);
  
  // Reset all filters to their default state
  const resetFilters = useCallback(() => {
    setSearch('');
    setSearchInput('');
    setSearchQueryParams({});
    setSelectedFilterValues(
      initialFilters.reduce((acc: { [key: string]: string }, filter) => {
        if (filter.filedType === 'select') {
          acc[filter.col_key] = 'All';
        }
        return acc;
      }, {})
    );
    
    onPaginationChange({
      ...initialPagination,
      page: 1,
    });
  }, [initialFilters, initialPagination, onPaginationChange]);
  
  // Return all state and handler functions
  return {
    // State
    search,
    searchInput,
    searchQueryParams,
    selectedFilterValues,
    
    // Handlers
    handleSearchChange,
    handleFilterChange,
    resetFilters,
    
    // Set functions for direct manipulation
    setSearch,
    setSearchInput,
    setSearchQueryParams,
    setSelectedFilterValues
  };
};