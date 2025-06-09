import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCcw,
  Loader2,
} from 'lucide-react';
import {
  useRefetchStockList,
  useStockList,
} from '@/hooks/api/stocks';
import { useNavigate } from 'react-router-dom';

const StockTable = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(''); // For immediate input update
  const [search, setSearch] = useState(''); // For debounced API calls
  const [size] = useState(20);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [exactSearch, setExactSearch] = useState(false);
  const [exchange, setExchange] = useState('ALL');
  const navigate = useNavigate();
  const {
    data: stocksResponse,
    refetch,
    isLoading: isListLoading,
  } = useStockList({
    page,
    size,
    search, // Using debounced search value
    sortField,
    sortOrder,
    exactSearch,
    exchange,
  });

  const {
    mutate,
    isSuccess: isRefetchStockListSuccess,
    isPending: isRefetching,
  } = useRefetchStockList();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(value => {
      setSearch(value);
      setPage(1); // Reset to first page on new search
    }, 500), // 500ms delay
    []
  );

  // Handle input change
  const handleSearchInput = e => {
    const value = e.target.value;
    setSearchInput(value); // Update visible input immediately
    debouncedSearch(value); // Debounce the actual search
  };

  // Handle form submission
  const handleSearch = e => {
    e.preventDefault();
    setSearch(searchInput); // Immediately apply the current input value
    setPage(1);
  };

  useEffect(() => {
    if (stocksResponse) {
      const { data: Data } = stocksResponse;
      setData(Data.data);
      setTotal(Data.total);
    }
  }, [stocksResponse]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cleanup debounce on unmount
    };
  }, [debouncedSearch]);

  const handleSort = field => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const totalPages = Math.ceil(total / size);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <div className="flex-1">
            <CardTitle>Stock List</CardTitle>
          </div>
          <Button
            className="bg-success hover:bg-green-600 text-white"
            onClick={() => mutate()}
            disabled={isRefetching}
          >
            {isRefetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refetching...
              </>
            ) : (
              <>
                Refetch Stocks
                <RefreshCcw className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <form onSubmit={handleSearch} className="flex flex-1 space-x-2">
              <Input
                placeholder="Search by Symbol or Name"
                value={searchInput}
                onChange={handleSearchInput}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="exactSearch"
                checked={exactSearch}
                onCheckedChange={() => setExactSearch(prev => !prev)}
              />
              <label htmlFor="exactSearch" className="text-sm">
                Exact Search
              </label>
            </div>

            <Select value={exchange} onValueChange={setExchange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Exchange" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="BSE">BSE</SelectItem>
                <SelectItem value="NSE">NSE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('token')}
                      className="h-8 p-0"
                    >
                      Token
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('symbol')}
                      className="h-8 p-0"
                    >
                      Symbol
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="h-8 p-0"
                    >
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('instrumenttype')}
                      className="h-8 p-0"
                    >
                      Instrument Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('exch_seg')}
                      className="h-8 p-0"
                    >
                      Exchange
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isListLoading || isRefetching ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading stocks...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map(item => (
                    <TableRow
                      key={item.token}
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => navigate(`/tradetips/create/${item.symbol}`)}
                    >
                      <TableCell>{item.token}</TableCell>
                      <TableCell>{item.symbol}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.instrumenttype}</TableCell>
                      <TableCell>{item.exch_seg}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockTable;
