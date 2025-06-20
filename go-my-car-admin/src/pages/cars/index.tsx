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
import { array } from 'zod';
const Cars = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });
  const onSuccessHandler = (data: any) => {
    Toast('success', data?.message || 'Car Deleted Successfully');
    refetch()

  };
  const { mutate: deleteCar, isSuccess: isDeleteSuccess } =
    useDeleteCars(onSuccessHandler);


  const handleDelete = (id: string) => {
    deleteCar(id);
  };

 const filters: Filter[] = [
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
    col_key: 'isAvailable',
    queryKey: 'isAvailable',
    filedType: 'select',
    placeHolder: 'isAvailable',
    defaultLabelValue: 'All Available/InAvailable  ', // optional fallback label
     options: [
        { label: 'Available', value: 'true' },
        { label: 'InAvailable', value: 'false' },
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
  } = useGetCars({
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
      accessorKey: 'carName',
       header: ({ column }) => (
              <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
               Car Name
                <ArrowUpDown className='ml-2 h-4 w-4' />
              </Button>
            ),
      cell: ({ row }) => <div>{row.getValue('carName')}</div>,
    },

    {
      accessorKey: 'carModal',
      header: 'Car Registration',
        cell: ({ row }) => {
          const startDate = row.original?.carModal;
          const formatted = startDate
            ? dayjs(startDate).format('DD MMM YYYY')
            : 'No start date';
      
          return <div>{formatted}</div>
            }
    },
    {
      accessorKey: 'carGear',
      header: 'Car Gear',
      cell: ({ row }) => <div>{row.getValue('carGear')}</div>,
      visible: false, // Hidden by default
    },
      {
      accessorKey: 'carType',
      header: 'Car Fuel',
      cell: ({ row }) => <div>{row.getValue('carType')}</div>,
      visible: false, // Hidden by default
    },
    {
      accessorKey: 'carSeat',
      header: 'Car Seat',
      cell: ({ row }) => <div>{row.getValue('carSeat')}</div>,
      visible: false, // Hidden by default
    },

   {
  accessorKey: 'price.price1hr', // Still okay for sorting/filtering if your table supports dot notation
  header: 'Car Price (1hr)',
  cell: ({ row }) => <div>{row.original.price?.price1hr}</div>,
  visible: false,
},
   {
  accessorKey: 'price.price8hr', // Still okay for sorting/filtering if your table supports dot notation
  header: 'Car Price (8hr)',
  cell: ({ row }) => <div>{row.original.price?.price8hr}</div>,
  visible: false,
},
   {
  accessorKey: 'price.price12hr', // Still okay for sorting/filtering if your table supports dot notation
  header: 'Car Price (12hr)',
  cell: ({ row }) => <div>{row.original.price?.price12hr}</div>,
  visible: false,
},
   {
  accessorKey: 'price.fullDay', // Still okay for sorting/filtering if your table supports dot notation
  header: 'Car Price (1 day)',
  cell: ({ row }) => <div>{row.original.price?.fullDay}</div>,
  visible: false,
},

    {
      accessorKey: 'chassicNo',
      header: 'Chassic No',
      cell: ({ row }) => <div>{row.getValue('chassicNo')}</div>,
      visible: false, // Hidden by default
    },

    
    {
      accessorKey: 'engineNo',
      header: 'Engine No',
      cell: ({ row }) => <div>{row.getValue('engineNo')}</div>,
      visible: false, // Hidden by default
    },
  {
      accessorKey: 'NumberPlate',
      header: 'Car Number',
      cell: ({ row }) => <div>{row.getValue('NumberPlate')}</div>,
      visible: false, // Hidden by default
    },
    {
      accessorKey: 'isAvailable',
      header: 'isAvailable',
      cell: ({ row }) => <div>
        {row.getValue('isAvailable') === true ? (
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
      accessorKey: 'location',
      header: 'location',
      cell: ({ row }) => <div>{row.getValue('location')}</div>,
      visible: false, // Hidden by default
    },
     {
      accessorKey: 'insuranceExpiry',
      header: 'Car insurance expiry',
        cell: ({ row }) => {
          const Date = row.original?.insuranceExpiry;
          const formatted = Date
            ? dayjs(Date).format('DD MMM YYYY')
            : 'No date';
      
          return <div>{formatted}</div>
            }
    },
    {
      accessorKey: 'carColor',
      header: 'Car Color',
      cell: ({ row }) => <div>{row.getValue('carColor')}</div>,
      visible: false, // Hidden by default
    },

  {
      accessorKey: 'averageRating',
      header: 'Rating',
      cell: ({ row }) => {
        const rating = row.getValue('averageRating');
    return <div>{rating ? rating : "-"}</div>;
    },
  },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex w-full gap-2">

          <Link
            to={`/car/view/${row.original._id}`}
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
  'Car Name',
  'Car Registration',
  'Car Gear',
  'Car Fuel',
  'Car Seat',
  'Price (1hr)',
  'Price (8hr)',
  'Price (12hr)',
  'Price (1 day)',
  'Chassis No',
  'Engine No',
  'Number Plate',
  'Availability',
  'Location',
  'Host Name',
  "Available Dates",
  "Unavailable Dates",
  "Feature",
  "Rating",
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


const rowdata = data.map((item: any) => ({
  'Car Name': item.carName || '',
  'Car Registration': item.carModal ? dayjs(item.carModal).format('DD MMM YYYY') : '',
  'Car Gear': item.carGear || '',
  'Car Fuel': item.carType || '',
  'Car Seat': item.carSeat || '',
  'Price (1hr)': item.price?.price1hr || '',
  'Price (8hr)': item.price?.price8hr || '',
  'Price (12hr)': item.price?.price12hr || '',
  'Price (1 day)': item.price?.fullDay || '',
  'Chassis No': item.chassicNo || '',
  'Engine No': item.engineNo || '',
  'Number Plate': item.NumberPlate || '',
  'Availability': item.isAvailable ? 'Active' : 'Inactive',
  'Location': item.location || '',
  "Host Name": item.hostName || '',
  'Available Dates': formatDateRange(item.availableDates),
  'Unavailable Dates': formatDateRange(item.unavailableDates),
   "Feature": Array.isArray(item.feature) ? item.feature.join(' ') : '',
   "Rating": item.averageRating ? item.averageRating : "",
  'Created At': item.createdAt ? dayjs(item.createdAt).format('DD MMM YYYY, hh:mm A') : '',
  'Updated At': item.updatedAt ? dayjs(item.updatedAt).format('DD MMM YYYY, hh:mm A') : '',
}));
const filename = `${new Date()}-car.xlsx`



  return (
    <div>
      <PageTitle title="Cars" />
      <div className="border rounded-xl p-4 flex flex-col min-h-[700px]">
        <div className="flex justify-between mb-4 gap-2">
          <div className="grid grid-cols-4 gap-2 flex-1">
            {/* <Input
              placeholder="Search Cars by carName"
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
            <Link to="/car/create">Create New Cars</Link>
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
      </div>
    </div>
  );
};

export default Cars;
