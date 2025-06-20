import DynamicDataTable from '@/components/datatable/datatable';
import PageTitle from '@/components/pageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteCars, useGetCars } from '@/hooks/api/cars';
import { Filter, useTableFilters } from '@/hooks/useTableFilters';
import CopyToClipboard from '@/components/copyToClipBoard';
import Toast from '@/components/toast/commonToast';
import { useGetNotificationList } from '@/hooks/api/notification';
import dayjs from 'dayjs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exportToExcel } from '@/lib/utils';

const Notifications = () => {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });


  const filters: Filter[] = [
    {
      col_key: 'title',
      filedType: 'input',
      queryKey: 'title',
      placeHolder: 'Search notification by title',
    },
    {
      col_key: 'description',
      filedType: 'input',
      queryKey: 'description',
      placeHolder: 'Search notification by description',
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
  } = useGetNotificationList({
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

  const handlePageChange = (page: number) =>
    setPagination(prev => ({ ...prev, page: page }));

  const columns: any[] = [
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
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
 {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
            cell: ({ row }: any) => (
        <div className="font-md rounded-md w-max px-2">
          {dayjs(row.getValue("createdAt")).format("DD MMMM, YYYY")}
        </div>
      ),
      // cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
   

  ];

  const header = ['Title', 'Description', 'Created At', 'Updated At'];
  const rowdata = data.map(item => ({
    'Title': item.title,
    'Description': item.description,
    'Created At': item.createdAt ? dayjs(item.createdAt).format('DD MMM YYYY, hh:mm A') : '',
    'Updated At': item.updatedAt ? dayjs(item.updatedAt).format('DD MMM YYYY, hh:mm A') : '',
  }));
  const filename = `${new Date()}-notification.xlsx`


  return (
    <div>
      <PageTitle title="Notifications" />
      <div className="border rounded-xl p-4 flex flex-col min-h-[700px]">
        <div className="flex justify-between mb-4 gap-2">
          <div className="grid grid-cols-2 gap-3 flex-1">
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
                      {filter.options?.map((option) => (
                        <SelectItem key={String(option.value)} value={String(option.value)}>
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
               <Link to="/notifications/create">Add New Notification</Link>

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
            <p className="text-red-500">Error fetching notification data</p>
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

export default Notifications;
