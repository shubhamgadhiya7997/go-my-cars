import DynamicDataTable from '@/components/datatable/datatable';
import PageTitle from '@/components/pageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTableFilters } from '@/hooks/useTableFilters';
import CopyToClipboard from '@/components/copyToClipBoard';
import { useGetPartner } from '@/hooks/api/partner';
import { useDeleteLocation, useGetLocation } from '@/hooks/api/location'
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exportToExcel } from '@/lib/utils';
import dayjs from 'dayjs';
import AlertDialogComponent from '@/components/alertDialog/alertConfirmDialog';
import Toast from '@/components/toast/commonToast';

const Location = () => {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });
    const [id, setId] = useState('');
  const [isDeleteUserAlertOpen, setDeleteUserAlertOpen] = useState(false);

    const onDeleteSuccessHandler = (data: any) => {
    Toast('success', data?.message || 'Location deleted successfully');
  };
  const { mutate: deleteLocation, isSuccess: isDeleteSuccess } =
    useDeleteLocation(onDeleteSuccessHandler);

  const handleDelete = () => {
    deleteLocation(id);
  };

console.log("1id", id)
  const filters = [
    {
      col_key: 'name',
      filedType: 'input',
      queryKey: 'name',
      placeHolder: 'Search location by name',
    },
    {
      col_key: 'isActive',
      queryKey: 'isActive',
      filedType: 'select',
      placeHolder: 'All Active/InActive',
      defaultLabelValue: 'All Active/InActive',
      options: [
        { label: 'Active', value: true },
        { label: 'InActive', value: false },
      ],
    },
  ];

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
  } = useGetLocation({
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

  console.log("data123", data)
  useEffect(() => {
    refetch();
  }, [
    pagination.page,
    pagination.limit,
    refetch,
    search,
    searchQueryParams,
    isDeleteSuccess
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
      accessorKey: 'name',
      header: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },

    {
      accessorKey: 'isActive',
      header: 'isActive',
      cell: ({ row }) => (
        <div>
          {row.getValue('isActive') === true ? (
            <span className='bg-green-100 text-green-800 px-2 py-1 rounded'>
              Active
            </span>
          ) : (
            <span className='bg-red-100 text-red-800 px-2 py-1 rounded'>
              InActive
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex w-full gap-2">

          <Link
            to={`/location/view/${row.original._id}`}
            className="hover:underline"
          >
            View
          </Link>
          <Link
            to='#'
            className='hover:underline text-red-500'
            onClick={() => { setDeleteUserAlertOpen(true); setId(row.original._id) }}
          >
            Delete
          </Link>

        </div>
      ),
    },

  ];
  const header = ['name', 'isActive'];
  const rowdata = data.map(item => ({
    'Name': item.name,
    'isActive': item.isActive
  }));
  const filename = `${new Date()}-location.xlsx`


  return (
    <div>
      <PageTitle title="Location" />
      <div className="border rounded-xl p-4 flex flex-col min-h-[700px]">
        <div className="flex justify-between mb-4 gap-2">
          <div className="grid grid-cols-3 gap-3 flex-1">
            {/* <Input
              placeholder="Search partner by email"
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
              className="max-w-sm"
            /> */}
            {filters.map((filter) =>
              filter.filedType === 'select' ? (
                <>
                  <Select
                    key={filter.col_key}
                    value={selectedFilterValues[filter.col_key]}
                    onValueChange={(value) => handleFilterChange(filter, value)}
                  >
                    <SelectTrigger className='max-w-52'>
                      <SelectValue placeholder={filter.placeHolder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='All'>
                        {filter.defaultLabelValue || 'All'}
                      </SelectItem>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <Input
                  key={filter.col_key}
                  placeholder={filter.placeHolder}
                  onChange={(e) => handleFilterChange(filter, e.target.value)}
                  className='max-w-sm'
                />
              )
            )}
          </div>
          <Button asChild>
            <Link to="/location/create">Create New Location</Link>
          </Button>

        </div>

        <div>
          <Button
            onClick={() => exportToExcel(header, rowdata, filename)}
            className="text-white mt-2 px-4 py-2 rounded"
          >
            Export to Excel
          </Button>
        </div>
        {isPending && (
          <div className="h-[600px] flex items-center justify-center">
            <Loader2 className="mr-2 h-10 w-10 animate-spin" />
          </div>
        )}
        {isError && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-red-500">Error fetching partner data</p>
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

         <AlertDialogComponent
        title='Are you sure you want Delete this Location?'
        description=''
        confirmText='Delete Location'
        cancelText='Cancel'
        onConfirm={() => handleDelete()}
        confirmButtonClass='bg-primary  hover:bg-primary-600'
        open={isDeleteUserAlertOpen}
        setOpen={setDeleteUserAlertOpen}
      />

    </div>
  );
};

export default Location;
