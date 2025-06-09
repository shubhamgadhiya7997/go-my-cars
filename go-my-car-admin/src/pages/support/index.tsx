import DynamicDataTable from '@/components/datatable/datatable';
import PageTitle from '@/components/pageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTableFilters } from '@/hooks/useTableFilters';
import CopyToClipboard from '@/components/copyToClipBoard';
import { useGetSupport } from '@/hooks/api/support';
import { Link } from 'react-router-dom';

const Supports = () => {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });
 

  const filters = [];

  const {
    search,
    searchInput,
    searchQueryParams,
    handleSearchChange,
    handleFilterChange,
  } = useTableFilters(filters, pagination, setPagination);

  const {
    data: apiResponse,
    isPending,
    isError,
    isSuccess,
    refetch,
  } = useGetSupport({
    limit: pagination.limit,
    page: pagination.page,
    search: search,
    ...searchQueryParams,
  });

  useEffect(() => {
    console.log("apiResponse", apiResponse)
    if (apiResponse) {
      const { data: Data } = apiResponse;
      const { page, limit, totalPages, totalDocs } = Data;
      console.log(Data, 'data');
      setData(Data?.docs);
      setPagination({ page, limit, totalPages, totalDocs });
    }
  }, [apiResponse]);

  useEffect(() => {
    refetch();
  }, [
    pagination.page,
    pagination.limit,
    refetch,
    search,
    searchQueryParams,
  ]);

  const handlePageChange = page =>
    setPagination(prev => ({ ...prev, page: page }));

  const columns = [
    {
      accessorKey: '_id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <CopyToClipboard text={row.getValue('_id')} />
        </div>
      ),
    },

    {
      accessorKey: 'email',
      header: 'email',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },

    {
      accessorKey: 'fullName',
      header: 'Full Name',
      cell: ({ row }) => <div>{row.getValue('fullName')}</div>,
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
      visible: false, // Hidden by default
    },
    {
      accessorKey: 'comment',
      header: 'comment',
      cell: ({ row }) => <div>{row.getValue('comment')}</div>,
      visible: false, // Hidden by default
    },
   {
  accessorKey: 'reply',
  header: 'Status',
  cell: ({ row }) => {
    const reply = row.getValue('reply');
    return <div>{reply ? 'Completed' : 'Pending'}</div>;
  },
},

   {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex w-full gap-2">

          <Link
            to={`/support/view/${row.original._id}`}
            className="hover:underline"
          >
            View
          </Link>
       
        </div>
      ),
    },
  
  ];

  return (
    <div>
      <PageTitle title="Supports" />
      <div className="border rounded-xl p-4 flex flex-col min-h-[700px]">
        <div className="flex justify-between mb-4 gap-2">
          <div className="grid grid-cols-2 gap-3 flex-1">
            <Input
              placeholder="Search Supports by email"
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
              className="max-w-sm"
            />

          </div>

        
        </div>
        {isPending && (
          <div className="h-[600px] flex items-center justify-center">
            <Loader2 className="mr-2 h-10 w-10 animate-spin" />
          </div>
        )}
        {isError && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-red-500">Error fetching support data</p>
          </div>
        )}
        {isSuccess && (
          <DynamicDataTable
            data={data}
            columns={columns}
            filters={filters}
            page={pagination?.page}
            totalPages={pagination?.totalPages}
            onPageChange={handlePageChange}
            handleFilter={handleFilterChange}
          />
        )}
      </div>
    </div>
  );
};

export default Supports;
