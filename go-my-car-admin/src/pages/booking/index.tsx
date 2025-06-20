import AlertDialogComponent from '@/components/alertDialog/alertConfirmDialog';
import CopyToClipboard from '@/components/copyToClipBoard';
import DynamicDataTable from '@/components/datatable/datatable';
import { CircleLoading } from '@/components/loader';
import Loader from '@/components/loader/loader';
import PageTitle from '@/components/pageTitle';
import Toast from '@/components/toast/commonToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCancelBookings, useGetBookings } from '@/hooks/api/booking';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Filter, useTableFilters } from '@/hooks/useTableFilters';

import { ArrowUpDown, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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

const Bookings = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });
  console.log("pagination", pagination)
  


 const filters: Filter[] = [
 {
      col_key: 'fullName',
      filedType: 'input',
      queryKey: 'fullName',
      placeHolder: 'Search users by full name',
    },

    {
      col_key: 'email',
      filedType: 'input',
      queryKey: 'email',
      placeHolder: 'Search users by email',
    },
    {
      col_key: 'carName',
      filedType: 'input',
      queryKey: 'carName',
      placeHolder: 'Search cars by car name',
    },
    {
      col_key: 'NumberPlate',
      filedType: 'input',
      queryKey: 'NumberPlate',
      placeHolder: 'Search cars by car number',
    },
     {
    col_key: 'carGear',
    queryKey: 'carGear',
    filedType: 'select',
    placeHolder: 'carGear',
    defaultLabelValue: 'All Manual/Auto  ', // optional fallback label
     options: [
        { label: 'Manual', value: "manual" },
        { label: 'Auto', value: "auto" },
      ],
  },
    {
    col_key: 'carType',
    queryKey: 'carType',
    filedType: 'select',
    placeHolder: 'carType',
    defaultLabelValue: 'All Petrol/Diesel  ', // optional fallback label
     options: [
        { label: 'Petrol', value: "petrol" },
        { label: 'Diesel', value: "diesel" },
      ],
  },
  {
    col_key: 'status',
    queryKey: 'status',
    filedType: 'select',
    placeHolder: 'status',
    defaultLabelValue: 'All Booking', // optional fallback label
     options: [
        { label: 'Completed', value: "Completed" },
        { label: 'Confirmed', value: "Confirmed" },
        { label: 'Ongoing', value: "Ongoing" },
        { label: 'Cancelled', value: "Cancelled" },
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
  } = useGetBookings({
    limit: pagination.limit,
    page: pagination.page,
    search: search,
     ...searchQueryParams,
  });
  console.log("apiResponse", apiResponse)

  
  useEffect(() => {
    if (apiResponse) {
      const { data: Data } = apiResponse;
      const { page, limit, totalPages, totalDocs } = Data;

      console.log("Data?.docs", Data)
      console.log("page", page)
      console.log("limit", limit)
      console.log("totalPages", totalPages)
      console.log("totalDocs", totalDocs)
      setData(Data.docs);
      setPagination({
        page,
        limit,
        totalPages,
        totalDocs,

      });
    }
  }, [apiResponse]);
  const onCancelSuccess = (data: any) => {
    console.log("data", data)
    Toast('success', data?.message || 'Booking cancel successfully');
  };
  const { mutate: deleteBooking, isSuccess: isCancelSuccess } =
    useCancelBookings(onCancelSuccess);


  useEffect(() => {
    refetch();
  }, [
    pagination.page,
    pagination.limit,
    refetch,
    isCancelSuccess
  ]);
  const handlePageChange = (page: number) => {
    setPagination((prev) => {
      return {
        ...prev,
        page: page,
      };
    });
  };

  console.log("data", data)


  const [isCancelBookingAlertOpen, setCancelBookingAlertOpen] = useState(false);

  const handleBooking = () => {
    deleteBooking(id);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: '_id',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <CopyToClipboard text={row.getValue('_id')} />
        </div>
      ),
    },
    {
      accessorFn: row => row.user?.fullName,
      id: 'fullName', // required when using accessorFn
       header: ({ column }) => (
                    <Button
                      variant='ghost'
                      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                    Full Name
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    </Button>
                  ),
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorFn: row => row.user,
      id: 'email',
 header: ({ column }) => (
              <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
             Email
                <ArrowUpDown className='ml-2 h-4 w-4' />
              </Button>
            ),
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.user?.email || 'No Email'}</div>;
      }

    },
    {
      accessorFn: row => row.car,
      id: 'carname',
       header: ({ column }) => (
              <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
               Car Name
                <ArrowUpDown className='ml-2 h-4 w-4' />
              </Button>
            ),
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.car?.carName || 'No Car Name'}</div>;
      }

    },
     {
      accessorFn: row => row.car,
      id: 'carGear',
      header: 'Car Gear',
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.car?.carGear || 'No Car Gear'}</div>;
      }

    },
     {
      accessorFn: row => row.car,
      id: 'carType',
      header: 'Car Type',
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.car?.carType || 'No Car Type'}</div>;
      }

    },
    {
      accessorFn: row => row.car,
      id: 'NumberPlate',
      header: 'Car Number',
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.car?.NumberPlate || 'No Car Number'}</div>;
      }

    },
    {
      accessorFn: row => row.car,
      id: 'chassicNo',
      header: 'ChassicNo',
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.car?.chassicNo || 'No Chassic No'}</div>;
      }

    },
    {
      accessorFn: row => row.car,
      id: 'engineNo',
      header: ' EngineNo',
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.car?.engineNo || 'No Engine No '}</div>;
      }

    },
    {
      accessorFn: row => row.car,
      id: 'location',
      header: ' location',
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.car?.location || 'No location'}</div>;
      }

    },
    {
      accessorFn: row => row.car,
      id: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => {
        const startDate = row.original?.startDate;
        const formatted = startDate
          ? dayjs(startDate).format('DD MMM YYYY, hh:mm A')
          : 'No start date';

        return <div>{formatted}</div>
      }

    },
    {
      accessorFn: row => row.car,
      id: 'endDate',
      header: 'End Date',
      cell: ({ row }) => {
        const endDate = row.original?.endDate;
        const formatted = endDate
          ? dayjs(endDate).format('DD MMM YYYY, hh:mm A')
          : 'No endDate date';

        return <div>{formatted}</div>
      }

    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');
        const startDate = row.original?.startDate;
        const endDate = row.original?.endDate;
        const now = dayjs();

        let effectiveStatus = status;
        // if (
        //   status === 'Confirmed' &&
        //   dayjs(startDate).isBefore(now) &&
        //   dayjs(endDate).isAfter(now)
        // ) {
        //   effectiveStatus = 'Ongoing';
        // }

        if (status === 'Confirmed') {
          if (now.isAfter(endDate)) {
            effectiveStatus = 'Completed';
          } else if (now.isAfter(startDate) && now.isBefore(endDate)) {
            effectiveStatus = 'Ongoing';
          }
        }
        let colorClass = '';
        switch (effectiveStatus) {
          case 'Ongoing':
            colorClass = 'bg-blue-100 text-blue-800';
            break;
          case 'Confirmed':
            colorClass = 'bg-yellow-100 text-yellow-800';
            break;
          case 'Completed':
            colorClass = 'bg-green-100 text-green-800';
            break;
          case 'Cancelled':
            colorClass = 'bg-red-100 text-red-800';
            break;
          default:
            colorClass = 'bg-gray-100 text-gray-800';
            break;
        }

        return (
          <span className={`px-2 py-1 rounded text-sm font-medium ${colorClass}`}>
            {effectiveStatus}
          </span>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {

        return (
          <div className='flex w-full items-center justify-center space-x-3'>

            <Link
              to='#'
              className='hover:underline text-red-500'
              onClick={() => { setCancelBookingAlertOpen(true); setId(row.original._id) }}
            >
              Cancel
            </Link>
          </div>

        );
      },
    },




  ];

  
const header = [
  'Full Name',
  'Email',
  'Status',
  "Start Date",
  "End Date",
   'Car Name',
  'Car Registration',
  'Car Gear',
  'Car Fuel',
  'Car Seat',
  'Chassis No',
  'Engine No',
  'Number Plate',
  'Location',
  "Feature",
  'Created At',
  'Updated At',
];

const formatDateRange = (arr) =>
  Array.isArray(arr) && arr.length > 0
    ? arr
        .map(d => {
          if (d?.startDate && d?.endDate) {
            return `${dayjs(d.startDate).format('DD MMM YYYY')} - ${dayjs(d.endDate).format('DD MMM YYYY')}`;
          }
          return '';
        })
        .filter(Boolean)
        .join(' | ')
    : 'N/A';


const rowdata = data.map((item: any) => {
  console.log("item", item); // ✅ Valid here

  return {
    'Full Name': item.user?.fullName || '',
    'Email': item.user?.email || '',
    'Status': item.car?.carName || '',
    'Start Date': item.startDate ? dayjs(item.startDate).format('DD MMM YYYY, hh:mm A') : '',
    'End Date': item.endDate ? dayjs(item.endDate).format('DD MMM YYYY, hh:mm A') : '',
    'Car Name': item.car?.carName || '',
    'Car Registration': item.car?.carModal ? dayjs(item.car.carModal).format('DD MMM YYYY') : '',
    'Car Gear': item.car?.carGear || '',
    'Car Fuel': item.car?.carType || '',
    'Car Seat': item.car?.carSeat || '',
    'Chassis No': item.car?.chassicNo || '',
    'Engine No': item.car?.engineNo || '',
    'Number Plate': item.car?.NumberPlate || '',
    'Location': item.car?.location || '',
    'Feature': Array.isArray(item.car?.feature) ? item.car.feature.join(', ') : '',
    'Created At': item.createdAt ? dayjs(item.createdAt).format('DD MMM YYYY, hh:mm A') : '',
    'Updated At': item.updatedAt ? dayjs(item.updatedAt).format('DD MMM YYYY, hh:mm A') : '',
  };
});

  
const filename = `${new Date()}-booking.xlsx`

  return (
    <div>
      <PageTitle title='Bookings' />

      <div className='border rounded-xl p-4 flex flex-start flex-col min-h-[700px] '>
        {/* ✅ Loader now fills the entire dashboard area */}

        {/* ✅ Error Message */}
        {isError && (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-red-500'>Error fetching data</p>
          </div>
        )}
                  <div className="grid grid-cols-4 gap-3 ">

        {/* <Input
          placeholder='Search Bookings by fullName'
          value={search}
          onChange={(e) => onHandleSearch(e.target.value)}
          className='max-w-sm'
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

          <div>
                            <Button
                              onClick={() => exportToExcel(header, rowdata, filename)}
                              className="text-white mt-2 px-4 py-2 rounded"
                            >
                              Export to Excel
                            </Button>
                          </div>


        {isPending && (
          <div className='h-[700px]'>
            <CircleLoading />
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
        title='Are you sure you want Cancel this booking?'
        description=''
        confirmText='Cancel Booking'
        cancelText='Cancel'
        onConfirm={() => handleBooking()}
        confirmButtonClass='bg-primary  hover:bg-primary-600'
        open={isCancelBookingAlertOpen}
        setOpen={setCancelBookingAlertOpen}
      />


    </div>
  );
};

export default Bookings;
