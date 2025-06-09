// import React from "react";
// import DynamicDataTable from "@/components/datatable/datatable";
// import PageTitle from "@/components/pageTitle";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// import { Loader2 } from "lucide-react";

// import { useDeleteFaqHook } from "@/hooks/api/faqs";
// import CopyToClipboard from "@/components/copyToClipBoard";
// import Toast from "@/components/toast/commonToast";
// import { useGetNotificationList } from "@/hooks/api/notification";
// import dayjs from "dayjs";

// const Notifications = () => {
//   const [data, setData] = useState([]);
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     perPage: 10,
//     totalPages: null,
//     totalDocs: null,
//   });

//   const {
//     data: apiResponse,
//     isLoading,
//     isError,
//     isSuccess,
//     refetch,
//   } = useGetNotificationList();

//   const onSuccessHandler = (data: any) => {
//     Toast("success", data?.message || "News created successfully");
//   };

//   const { mutate: deleteFaq, isSuccess: isDeleteSuccess } =
//     useDeleteFaqHook(onSuccessHandler);

//   console.log("APIRESPONSE NOTIFICATION:>>", apiResponse);
//   console.log("data", data);

//   useEffect(() => {
//     if (apiResponse) {
//       const { data: Data } = apiResponse;
//       // console.log("dosinvsiikvneroievnbewi", Data)
//       setData(Data?.docs);
//     }
//   }, [apiResponse]);

//   useEffect(() => {
//     if (isDeleteSuccess) refetch();
//   }, [isDeleteSuccess]);

//   const handleDelete = (id: string) => {
//     deleteFaq(id);
//   };

//   const columns = [
//     {
//       accessorKey: "title",
//       header: "Title",
//       cell: ({ row }: any) => (
//         <div className="font-md rounded-md w-max px-2">
//           <CopyToClipboard text={row.getValue("title")} />
//         </div>
//       ),
//     },
//     {
//       accessorKey: "description",
//       header: "Description",
//       cell: ({ row }: any) => (
//         <div className="font-md rounded-md w-max px-2">
//           {row.getValue("description")}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Date",
      // cell: ({ row }: any) => (
      //   <div className="font-md rounded-md w-max px-2">
      //     {dayjs(row.getValue("createdAt")).format("DD MMMM, YYYY")}
      //   </div>
      // ),
//     },
//   ];

//   return (
//     <div>
//       {isLoading ? (
//         <div className="flex justify-center items-center h-screen">
//           <Loader2 size={40} className="animate-spin text-[#2A9D90]" />
//         </div>
//       ) : (
//         <>
//           <PageTitle title="Notifications List" />
//           <div className="border rounded-xl p-4 flex flex-col min-h-[700px]">
//             <div className="flex justify-between mb-4 gap-2">
//               <div className="grid grid-cols-7 gap-3 flex-1">
//                 <Input
//                   placeholder="Search Notification"
//                   // value={searchInput}
//                   // onChange={(e) => handleSearchChange(e.target.value)}
//                   className="max-w-sm"
//                 />
//               </div>

//               <Button asChild>
//                 <Link to="/notifications/create">Add New Notification</Link>
//               </Button>
//             </div>

//             {isError && (
//               <div className="flex flex-1 items-center justify-center">
//                 <p className="text-red-500">Error fetching News data</p>
//               </div>
//             )}
//             {isSuccess && <DynamicDataTable data={data} columns={columns} />}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Notifications;
import DynamicDataTable from '@/components/datatable/datatable';
import PageTitle from '@/components/pageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowUpDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteCars, useGetCars } from '@/hooks/api/cars';
import { useTableFilters } from '@/hooks/useTableFilters';
import CopyToClipboard from '@/components/copyToClipBoard';
import Toast from '@/components/toast/commonToast';
import { useGetNotificationList } from '@/hooks/api/notification';
import dayjs from 'dayjs';

const Notifications = () => {

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: null,
    totalDocs: null,
  });


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

  return (
    <div>
      <PageTitle title="Notifications" />
      <div className="border rounded-xl p-4 flex flex-col min-h-[700px]">
        <div className="flex justify-between mb-4 gap-2">
          <div className="grid grid-cols-2 gap-3 flex-1">


          </div>

          <Button asChild>
               <Link to="/notifications/create">Add New Notification</Link>

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
