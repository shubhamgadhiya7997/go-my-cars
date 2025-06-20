import DynamicDataTable from '@/components/datatable/datatable';
import PageTitle from '@/components/pageTitle';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usedeleteBanner } from '@/hooks/api/banner';
import { Filter, useTableFilters } from '@/hooks/useTableFilters';
import CopyToClipboard from '@/components/copyToClipBoard';
import Toast from '@/components/toast/commonToast';
import { useGetBanner, useUpdateBanner } from '@/hooks/api/banner';
import AlertDialogComponent from '@/components/alertDialog/alertConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { useGetFavorite } from '@/hooks/api/favorite';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { exportToExcel } from '@/lib/utils';
import dayjs from 'dayjs';

const Favorite = () => {

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
  } = useGetFavorite({
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

  interface UpdateBannerPayload {
    userId: string;
    isSelected: boolean;
  }
  const handleActiveUser = (value: boolean) => {
    const payload: UpdateBannerPayload = {
      userId: id,
      isSelected: value,
    };
    activeInactive(payload);
    console.log('Payload:>>', payload);
  };
  const handlePageChange = (page: any) =>
    setPagination(prev => ({ ...prev, page: page }));

  interface Banner {
    _id: string;
    isSelected: boolean;
  }

  const columns: ColumnDef<Banner>[] = [
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

  ];

  const header = [
    'Full Name',
    'Email',
    'Car Name',
    'Car Gear',
    'Car Fuel',
    'Chassis No',
    'Engine No',
    'Number Plate',
    'Created At',
    'Updated At'];

  const rowdata = data.map(item => ({
    'Full Name': item.user?.fullName || '',
    'Email': item.user?.email || '',
    'Car Name': item.car?.carName || '',
    'Car Gear': item.car?.carGear || '',
    'Car Fuel': item.car?.carType || '',
    'Chassis No': item.car?.chassicNo || '',
    'Engine No': item.car?.engineNo || '',
    'Number Plate': item.car?.NumberPlate || '',
    'Created At': item.createdAt ? dayjs(item.createdAt).format('DD MMM YYYY, hh:mm A') : '',
    'Updated At': item.updatedAt ? dayjs(item.updatedAt).format('DD MMM YYYY, hh:mm A') : '',
  }));
  const filename = `${new Date()}-favorite.xlsx`



  return (
    <div>
      <PageTitle title="Favorites" />
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
            <p className="text-red-500">Error fetching car favorite data</p>
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

export default Favorite;


