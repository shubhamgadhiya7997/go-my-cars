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
import { useGetBookings } from '@/hooks/api/booking';
import { activeInactiveUserHook, useUsers } from '@/hooks/api/users/useUsers';
import { ACCOUNT_STATUS, BASE_API_URL } from '@/utils/constants';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Bookings = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [id, setId] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });
  console.log("pagination", pagination)
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
  });
  console.log("apiResponse", apiResponse)
  const onSuccessHandler = (data: any) => {
    Toast('success', data?.message || 'Booking created successfully');
  };
  const { mutate: activeInactive, isSuccess: activateUserSuccess } =
    activeInactiveUserHook(onSuccessHandler);
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
  useEffect(() => {
    refetch();
  }, [
    pagination.page,
    pagination.limit,
    refetch,
    activateUserSuccess,
  ]);
  const handlePageChange = (page) => {
    setPagination((prev) => {
      return {
        ...prev,
        page: page,
      };
    });
  };
  const onHandleSearch = (value) => {
    setSearch(value);
    setPagination((prev) => {
      return {
        ...prev,
        page: 1,
      };
    });
  };

  const handleActiveUser = (value: number) => {
    const payload = {
      userId: id,
      isActive: value,
    };
    activeInactive(payload);
    console.log('Payload:>>', payload);
  };
  console.log("data", data)
  const [isInactiveUserAlertOpen, setIsInactiveUserAlertOpen] = useState(false);
  const [isActiveUserAlertOpen, setActiveUserAlertOpen] = useState(false);
  const columns: ColumnDef[] = [
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
      header: 'Full Name',
      cell: ({ getValue }) => <div>{getValue()}</div>,
    },
    {
      accessorFn: row => row.user,
      id: 'email',
      header: 'Email',
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.user?.email || 'No Email'}</div>;
      }

    },
     {
      accessorFn: row => row.car,
      id: 'carname',
      header: 'Car Name',
      cell: ({ row }) => {
        console.log('Row data:', row.original);
        return <div>{row.original.car?.carName || 'No Car Name'}</div>;
      }

    },
         {
      accessorFn: row => row.car,
      id: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => {
    const startDate = row.original.car?.startDate;
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
    const endDate = row.original.car?.endDate;
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

    let colorClass = '';
    switch (status) {
      case 'Pending':
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
        {status}
      </span>
    );
  },
},



   
  
  ];
  const filters = [

  ];
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
        <Input
          placeholder='Search Bookings by fullName'
          value={search}
          onChange={(e) => onHandleSearch(e.target.value)}
          className='max-w-sm'
        />
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
          />
        )}
      </div>
      <AlertDialogComponent
        title='Are you sure you want Active this User?'
        description=''
        confirmText='Activate User'
        cancelText='Cancel'
        onConfirm={() => handleActiveUser(true)}
        confirmButtonClass='bg-primary  hover:bg-primary-600'
        open={isActiveUserAlertOpen}
        setOpen={setActiveUserAlertOpen}
      />
      <AlertDialogComponent
        title='Are you sure you want In Active this User?'
        description=''
        confirmText='InActive User'
        cancelText='Cancel'
        onConfirm={() => handleActiveUser(false)}
        confirmButtonClass='bg-destructive text-white hover:bg-red-600'
        open={isInactiveUserAlertOpen}
        setOpen={setIsInactiveUserAlertOpen}
      />
    </div>
  );
};

export default Bookings;
