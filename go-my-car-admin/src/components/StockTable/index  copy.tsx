import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  useRefetchStockList,
  useStockList,
} from '@/hooks/api/stocks';

const StockTable = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [size] = useState(20);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [exactSearch, setExactSearch] = useState(false);
  const [exchange, setExchange] = useState('ALL');

  //   const fetchData = async () => {
  //     try {
  //       //   const response = await fetch(
  //       //     `http://localhost:5002/stocks?page=${page}&size=${size}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}&exactSearch=${exactSearch}&exchange=${exchange}`
  //       //   );
  //       const response = await fetch(
  //         `http://localhost:5000/gujjutraders/admin/v1/stocks/list?page=${page}&size=${size}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}&exactSearch=${exactSearch}&exchange=${exchange}`
  //       );
  //       const { data: result } = await response.json();
  //       setData(result.data);
  //       setTotal(result.total);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  const { data: stocksResponse, refetch } = useStockList({
    page,
    size,
    search,
    sortField,
    sortOrder,
    exactSearch,
    exchange,
  });
  const {
    mutate,
    isSuccess: isRefetchStockListSuccess,
    isPending,
  } = useRefetchStockList();

  useEffect(() => {
    if (stocksResponse) {
      const { data: Data } = stocksResponse;
      setData(Data.data);
      setTotal(Data.total);
    }
  }, [stocksResponse]);
  useEffect(() => {
    refetch();
  }, [page, search, sortField, sortOrder, exactSearch, exchange]);

  const handleSearch = e => {
    setPage(1);
    e.preventDefault();
    // fetchData();
  };

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
          >
            Refetch Stocks
            <RefreshCcw />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-1 space-x-2">
              <Input
                placeholder="Search by Symbol or Name"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>

            {/* Exact Search */}
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

            {/* Exchange Select */}
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
          <div className="rounded-md border">
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
                {data.map((item, index) => (
                  <TableRow key={item.token}>
                    <TableCell>{item.token}</TableCell>
                    <TableCell>{item.symbol}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.instrumenttype}</TableCell>
                    <TableCell>{item.exch_seg}</TableCell>
                  </TableRow>
                ))}
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
