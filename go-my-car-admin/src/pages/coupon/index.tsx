import DynamicDataTable from '@/components/datatable/datatable';
import PageTitle from '@/components/pageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Filter, useTableFilters } from '@/hooks/useTableFilters';
import CopyToClipboard from '@/components/copyToClipBoard';
import { useGetSupport } from '@/hooks/api/support';
import { Link } from 'react-router-dom';
import { useDeleteCoupon, useGetCoupon } from '@/hooks/api/coupon';
import Toast from '@/components/toast/commonToast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import dayjs from 'dayjs';
import { exportToExcel } from '@/lib/utils';
const Coupon = () => {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });

  const onSuccessHandler = (data: any) => {

    console.log("🍀 onSuccessHandler called with:", data);
    Toast('success', data.message || 'Coupon Deleted Successfully');
    refetch();


  };
  const { mutate: deleteCoupon, isSuccess: isDeleteSuccess } =
    useDeleteCoupon(onSuccessHandler);


  const handleDelete = (id: string) => {
    deleteCoupon(id);
  };



  const filters: Filter[] = [
    {
      col_key: 'couponCode',
      filedType: 'input',
      queryKey: 'couponCode',
      placeHolder: 'Search coupon by coupon code',
    },
    {
      col_key: 'amount',
      filedType: 'input',
      queryKey: 'amount',
      placeHolder: 'Search coupon by amount',
    },

    {
      col_key: 'isActive',
      queryKey: 'isActive',
      filedType: 'select',
      placeHolder: 'All Active/InActive',
      defaultLabelValue: 'All Active/InActive  ', // optional fallback label
      options: [
        { label: 'Active', value: 'true' },
        { label: 'InActive', value: 'false' },
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
    refetch,
    isPending,
    isError,
    isSuccess
  } = useGetCoupon({
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
      accessorKey: 'couponCode',
      header: 'Coupon Code',
      cell: ({ row }) => <div>{row.getValue('couponCode')}</div>,
    },

    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div>{row.getValue('amount')}</div>,
    },

    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => <div>
        {row.getValue('isActive') === true ? (
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
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex w-full gap-2">

          <Link
            to={`/coupon/view/${row.original._id}`}
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

  const header = [
    "Coupon Code",
    "Amount",
    "Status",
    'Created At',
    'Updated At',
  ]

  const rowdata = data.map((item: any) => ({
    'Coupon Code': item.couponCode || '',
    'Amount': item.amount || '',
    'Status': item.isActive ? 'Active' : 'Inactive',
    'Created At': item.createdAt ? dayjs(item.createdAt).format('DD MMM YYYY, hh:mm A') : '',
    'Updated At': item.updatedAt ? dayjs(item.updatedAt).format('DD MMM YYYY, hh:mm A') : '',

  }));

  const filename = `${new Date()}-coupon.xlsx`

  return (
    <div>
      <PageTitle title="Coupons" />
      <div className="border rounded-xl p-4 flex flex-col min-h-[700px]">
        <div className="flex justify-between mb-4 gap-2">
          <div className="grid grid-cols-3 gap-3 flex-1">
            {/* <Input
              placeholder="Search coupons by couponcode"
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
            <Link to="/coupon/create">Create New Coupon</Link>
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
            <p className="text-red-500">Error fetching Coupons data</p>
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

export default Coupon;

