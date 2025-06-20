import AlertDialogComponent from '@/components/alertDialog/alertConfirmDialog';
import CopyToClipboard from '@/components/copyToClipBoard';
import DynamicDataTable from '@/components/datatable/datatable';
import { CircleLoading } from '@/components/loader';
import PageTitle from '@/components/pageTitle';
import Toast from '@/components/toast/commonToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { activeInactiveUserHook, useDeleteUsers, useUsers } from '@/hooks/api/users/useUsers';
import { ACCOUNT_STATUS, BASE_API_URL } from '@/utils/constants';
import { ColumnDef } from '@tanstack/react-table';
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
import dayjs from 'dayjs';


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
  const [searchQueryParams, setSearchQueryParams] = useState({});
  console.log("searchQueryParams", searchQueryParams)
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
    ...searchQueryParams,
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

  const onDeleteSuccessHandler = (data: any) => {
    Toast('success', data?.message || 'User deleted successfully');
  };
  const { mutate: deleteUser, isSuccess: isDeleteSuccess } =
    useDeleteUsers(onDeleteSuccessHandler);


  useEffect(() => {
    refetch();
  }, [
    pagination.page,
    pagination.limit,
    refetch,
    activateUserSuccess,
    isDeleteSuccess
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





  const handleDelete = () => {
    deleteUser({ userId: id });
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
  const [isDeleteUserAlertOpen, setDeleteUserAlertOpen] = useState(false);
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
        header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Full Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
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
              InActive
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'profilePic',
      header: 'Profile Image',
      cell: ({ row }) => {
          const profilePic = row.getValue('profilePic');
        const imageUrl = `${BASE_API_URL}/static/${row.getValue('profilePic')}`;
          return profilePic ? (
      <img
        src={imageUrl}
        alt="Profile"
        className="h-10 w-10 rounded-full object-cover"
      />
    ) : (
      <span className="">-</span>
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
            <Link
              to='#'
              className='hover:underline text-red-500'
              onClick={() => { setDeleteUserAlertOpen(true); setId(row.original._id) }}
            >
              Delete
            </Link>
          </div>

        );
      },
    },
  ];
  const filters = [
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
      col_key: 'phoneNumber',
      filedType: 'input',
      queryKey: 'phoneNumber',
      placeHolder: 'Search users by phone number',
    },
    {
      col_key: 'isActive',
      queryKey: 'isActive',
      filedType: 'select',
      placeHolder: 'isActive',
      defaultLabelValue: 'All Active/InActive', // optional fallback label
      options: [
        { label: 'Active', value: true },
        { label: 'InActive', value: false },
      ],
    },
  ];
  // const [selectedFilterValues, setSelectedFilterValues] = useState(
  //   filters.reduce((acc, filter) => {
  //     acc[filter.col_key] = 'All';
  //     return acc;
  //   }, {})

  // );
  const [selectedFilterValues, setSelectedFilterValues] = useState(
    filters.reduce((acc, filter) => {
      if (filter.filedType === 'select') {
        acc[filter.col_key] = 'All';
      }
      return acc;
    }, {})
  );

  const handleFilterChange = (filter, value) => {
    setSelectedFilterValues((prev) => ({
      ...prev,
      [filter.col_key]: value,
    }));

    if (
      (filter.filedType === 'select' && value === 'All') ||
      (filter.filedType === 'input' && value === '')
    ) {
      const { [filter.queryKey]: value, ...newSearchQueryParams } = searchQueryParams;
      setSearchQueryParams(newSearchQueryParams);
    } else {
      setSearchQueryParams((prev) => ({
        ...prev,
        [filter.queryKey]: value,
      }));
    }

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const header = ['Full Name', 'Email', 'Phone', 'Status', 'Created At', 'Updated At'];
  const rowdata = data.map(item => ({
    'Full Name': item.fullName,
    'Email': item.email,
    'Phone': item.phoneNumber,
    'Status': item.isActive ? 'Active' : 'Inactive',
    'Created At': item.createdAt ? dayjs(item.createdAt).format('DD MMM YYYY, hh:mm A') : '',
    'Updated At': item.updatedAt ? dayjs(item.updatedAt).format('DD MMM YYYY, hh:mm A') : '',
  }));
  const filename = `${new Date()}-user.xlsx`



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
        <div className='grid grid-cols-4 gap-2 '>
          {/* <Input
          placeholder='Search users by full name'
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
          />
        )}
      </div>

      <AlertDialogComponent
        title='Are you sure you want Delete this User?'
        description=''
        confirmText='Delete User'
        cancelText='Cancel'
        onConfirm={() => handleDelete()}
        confirmButtonClass='bg-primary  hover:bg-primary-600'
        open={isDeleteUserAlertOpen}
        setOpen={setDeleteUserAlertOpen}
      />

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
