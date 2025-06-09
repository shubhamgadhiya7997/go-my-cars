import AlertDialogComponent from '@/components/alertDialog/alertConfirmDialog';
import CopyToClipboard from '@/components/copyToClipBoard';
import DynamicDataTable from '@/components/datatable/datatable';
import { CircleLoading } from '@/components/loader';
import PageTitle from '@/components/pageTitle';
import Toast from '@/components/toast/commonToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { activeInactiveUserHook, useUsers } from '@/hooks/api/users/useUsers';
import { ACCOUNT_STATUS, BASE_API_URL } from '@/utils/constants';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Users = () => {
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
  } = useUsers({
    limit: pagination.limit,
    page: pagination.page,
    search: search,
  });
  console.log("apiResponse", apiResponse)
  const onSuccessHandler = (data: any) => {
    Toast('success', data?.message || 'User updated successfully');
  };
  const { mutate: activeInactive, isSuccess: activateUserSuccess } =
    activeInactiveUserHook(onSuccessHandler);

  useEffect(() => {
    if (apiResponse) {
      const { data: Data } = apiResponse;
      const { page, limit, totalPages, totalDocs } = Data;
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
      accessorKey: 'fullName',
      header: 'Full Name',
      cell: ({ row }) => <div>{row.getValue('fullName')}</div>,
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
      cell: ({ row }) => (
        <div>
          {' '}
          <CopyToClipboard
            text={row.getValue('phoneNumber')}
            textStyle='font-semibold'
          />
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),

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
              Inactive
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'profilePic',
      header: 'Profile Image',
      cell: ({ row }) => {
        const imageUrl = `${BASE_API_URL}/static/${row.getValue('profilePic')}`;
        return (
          <img
            src={imageUrl}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
          />
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className='flex w-full items-center justify-center space-x-3'>


            {row.getValue('isActive') === ACCOUNT_STATUS.ACTIVE ? (
              <Button
                variant={'destructive'}
                onClick={() => {
                  setIsInactiveUserAlertOpen(true);
                  setId(user._id);
                }}
              >
                InActive
              </Button>
            ) : (
              <Button
                variant={'default'}
                onClick={() => {
                  setActiveUserAlertOpen(true);
                  setId(user._id);
                }}
              >
                Activate
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  const filters = [];
  return (
    <div>
      <PageTitle title='Users' />

      <div className='border rounded-xl p-4 flex flex-start flex-col min-h-[700px] '>
        {/* ✅ Loader now fills the entire dashboard area */}

        {/* ✅ Error Message */}
        {isError && (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-red-500'>Error fetching data</p>
          </div>
        )}
        <Input
          placeholder='Search users by full name'
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

export default Users;
