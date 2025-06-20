import DynamicDataTable from '@/components/datatable/datatable';
import PageTitle from '@/components/pageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTableFilters } from '@/hooks/useTableFilters';
import CopyToClipboard from '@/components/copyToClipBoard';
import { useGetPartner } from '@/hooks/api/partner';
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
const Partners = () => {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });
 

  const filters = [
    {
      col_key: 'fullName',
      filedType: 'input',
      queryKey: 'fullName',
      placeHolder: 'Search partner by full name',
    },
    {
      col_key: 'email',
      filedType: 'input',
      queryKey: 'email',
      placeHolder: 'Search partner by email',
    },
   
    {
      col_key: 'status',
      queryKey: 'status',
      filedType: 'select',
      placeHolder: 'All Pending/Completed',
      defaultLabelValue: 'All Pending/Completed  ', // optional fallback label
      options: [
        { label: 'Pending', value: false },
        { label: 'Completed', value: true },
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
  } = useGetPartner({
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
      accessorKey: 'detail',
      header: 'Query',
      cell: ({ row }) => <div>{row.getValue('detail')}</div>,
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
            to={`/partner/view/${row.original._id}`}
            className="hover:underline"
          >
            View
          </Link>
       
        </div>
      ),
    },
  
  ];
const header = ['Full Name', 'Email', 'Query', 'Status','Reply', 'Created At', 'Updated At'];
  const rowdata = data.map(item => ({
    'Full Name': item.fullName,
    'Email': item.email,
    'Query': item.detail,
    'Status': item.reply ? 'Completed' : 'Pending',
    'Reply': item.reply ? item.reply : "-",
    'Created At': item.createdAt ? dayjs(item.createdAt).format('DD MMM YYYY, hh:mm A') : '',
    'Updated At': item.updatedAt ? dayjs(item.updatedAt).format('DD MMM YYYY, hh:mm A') : '',
  }));
  const filename = `${new Date()}-partner.xlsx`


  return (
    <div>
      <PageTitle title="partners" />
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
    </div>
  );
};

export default Partners;
