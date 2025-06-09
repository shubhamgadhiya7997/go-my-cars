import DynamicDataTable from '@/components/datatable/datatable';
import PageTitle from '@/components/pageTitle';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usedeleteBanner } from '@/hooks/api/banner';
import { useTableFilters } from '@/hooks/useTableFilters';
import CopyToClipboard from '@/components/copyToClipBoard';
import Toast from '@/components/toast/commonToast';
import { useGetBanner, useUpdateBanner } from '@/hooks/api/banner';
import AlertDialogComponent from '@/components/alertDialog/alertConfirmDialog';

const Banner = () => {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });
  const [isInactiveUserAlertOpen, setIsInactiveUserAlertOpen] = useState(false);
  const [isActiveUserAlertOpen, setActiveUserAlertOpen] = useState(false);

  const onSuccessHandler = (data: any) => {
    Toast('success', data?.message || 'carbanner deleted successfully');
    refetch()

  };
  const { mutate: deleteBanner, isSuccess: isDeleteSuccess } =
    usedeleteBanner(onSuccessHandler);
  // const { mutate: activeInactive, isSuccess: activateUserSuccess } =
  //   activeInactiveUserHook(onSuccessHandler);

  const [id, setId] = useState('');

  const handleDelete = (id: string) => {
    deleteBanner(id);
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
  } = useGetBanner({
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
      console.log(Data, 'data1');
      setData(Data.docs);
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

 const { mutate: activeInactive, isSuccess: activateUserSuccess } =
    useUpdateBanner(onSuccessHandler);


  const handleActiveUser = (value: number) => {
    const payload = {
      userId: id,
      isSelected: value,
    };
    activeInactive(payload);
    console.log('Payload:>>', payload);
  };
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
      accessorKey: 'isSelected',
      header: 'isSelected',
      cell: ({ row }) => <div>
        {row.getValue('isSelected') === true ? (
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
          <div className='flex w-full items-center justify-center space-x-3'>


            {row.getValue('isSelected') === true ? (
              <Button
                variant={'destructive'}
                onClick={() => {
                  setIsInactiveUserAlertOpen(true);
                  setId(row.original._id);
                }}
              >
                InActive
              </Button>
            ) : (
              <Button
                variant={'default'}
                onClick={() => {
                  setActiveUserAlertOpen(true);
                  setId(row.original._id);
                }}
              >
                Activate
              </Button>
            )}
          </div>
          <Link
            to={`/banner/view/${row.original._id}`}
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
      <PageTitle title="Banners" />
      <div className="border rounded-xl p-4 flex flex-col min-h-[700px]">
        <div className="flex justify-between mb-4 gap-2">
          <div className="grid grid-cols-2 gap-3 flex-1">

          </div>

          <Button asChild>
            <Link to="/banner/create">Create New Banner</Link>
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
        <AlertDialogComponent
          title='Are you sure you want Active this Banner?'
          description=''
          confirmText='Activate Banner'
          cancelText='Cancel'
          onConfirm={() => handleActiveUser(true)}
          confirmButtonClass='bg-primary  hover:bg-primary-600'
          open={isActiveUserAlertOpen}
          setOpen={setActiveUserAlertOpen}
        />
        <AlertDialogComponent
          title='Are you sure you want In Active this Banner?'
          description=''
          confirmText='InActive Banner'
          cancelText='Cancel'
          onConfirm={() => handleActiveUser(false)}
          confirmButtonClass='bg-destructive text-white hover:bg-red-600'
          open={isInactiveUserAlertOpen}
          setOpen={setIsInactiveUserAlertOpen}
        />
      </div>
    </div>
  );
};

export default Banner;


