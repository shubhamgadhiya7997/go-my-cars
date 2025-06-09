import DynamicDataTable from '@/components/datatable/datatable';
import PageTitle from '@/components/pageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteCars, useGetCars } from '@/hooks/api/cars';
import { useTableFilters } from '@/hooks/useTableFilters';
import CopyToClipboard from '@/components/copyToClipBoard';
import Toast from '@/components/toast/commonToast';

const Cars = () => {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });
  const onSuccessHandler = (data: any) => {
    Toast('success', data?.message || 'Car Deleted Successfully');
    refetch()

  };
  const { mutate: deleteCar, isSuccess: isDeleteSuccess } =
    useDeleteCars(onSuccessHandler);


  const handleDelete = (id: string) => {
    deleteCar(id);
  };


  const filters = [];

  const {
    search,
    searchInput,
    searchQueryParams,
    selectedFilterValues,
    handleSearchChange,
    handleFilterChange,
    resetFilters,
  } = useTableFilters(filters, pagination, setPagination);

  const {
    data: apiResponse,
    isPending,
    isError,
    isSuccess,
    refetch,
  } = useGetCars({
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
      accessorKey: 'carName',
      header: 'car Name',
      cell: ({ row }) => <div>{row.getValue('carName')}</div>,
    },

    {
      accessorKey: 'carModal',
      header: 'car Modal',
      cell: ({ row }) => <div>{row.getValue('carModal')}</div>,
    },
    {
      accessorKey: 'carGear',
      header: 'car Gear',
      cell: ({ row }) => <div>{row.getValue('carGear')}</div>,
      visible: false, // Hidden by default
    },
    {
      accessorKey: 'carSheet',
      header: 'car Sheet',
      cell: ({ row }) => <div>{row.getValue('carSheet')}</div>,
      visible: false, // Hidden by default
    },

    {
      accessorKey: 'carPrice',
      header: 'carPrice (hr) ',
      cell: ({ row }) => <div>{row.getValue('carPrice')}</div>,
      visible: false, // Hidden by default
    },
    {
      accessorKey: 'isAvailable',
      header: 'isAvailable',
      cell: ({ row }) => <div>
        {row.getValue('isAvailable') === true ? (
          <span className='bg-green-100 text-green-800 px-2 py-1 rounded'>
            Active
          </span>
        ) : (
          <span className='bg-red-100 text-red-800 px-2 py-1 rounded'>
            Inactive
          </span>
        )}
      </div>,
      visible: false, // Hidden by default
    },


    {
      accessorKey: 'location',
      header: 'location',
      cell: ({ row }) => <div>{row.getValue('location')}</div>,
      visible: false, // Hidden by default
    },


    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex w-full gap-2">

          <Link
            to={`/car/view/${row.original._id}`}
            className="hover:underline"
          >
            View
          </Link>
          <Link
            to='#'
            className='hover:underline text-red-500'
            onClick={() => handleDelete(row.original._id)}
          >
            Delete
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageTitle title="Cars" />
      <div className="border rounded-xl p-4 flex flex-col min-h-[700px]">
        <div className="flex justify-between mb-4 gap-2">
          <div className="grid grid-cols-2 gap-3 flex-1">
            <Input
              placeholder="Search Cars by carName"
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
              className="max-w-sm"
            />

          </div>

          <Button asChild>
            <Link to="/car/create">Create New Cars</Link>
          </Button>
        </div>
        {isPending && (
          <div className="h-[600px] flex items-center justify-center">
            <Loader2 className="mr-2 h-10 w-10 animate-spin" />
          </div>
        )}
        {isError && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-red-500">Error fetching car data</p>
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

export default Cars;
