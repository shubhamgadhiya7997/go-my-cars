'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, X } from 'lucide-react';
import dayjs from 'dayjs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import DashBoardCard from './DashBoardCard';
import { useDashboard } from '@/hooks/api/dashboard';

interface IDate {
  fromDate: string;
  toDate: string;
}

const Dashboard = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [dashboardData, setDashboardData] = useState<any>();
  const [date, setDate] = useState<IDate>();

  const { data, isSuccess, refetch } = useDashboard(date);
  console.log('Dashboard Data:>>', dashboardData);

  useEffect(() => {
    if (isSuccess && data) {
      setDashboardData(data?.data);
    }
  }, [isSuccess, data]);

  const handleFilterReferrals = () => {
    const payload = {
      fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : '',
      toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : '',
    };

    setDate(payload);
  };

  console.log('Date:>>', date);

  const handleResetDate = () => {
    setDate({});
    setFromDate(undefined);
    setToDate(undefined);
    refetch();
  };

  return (
    <div className='flex flex-col flex-1 h-full bg-gradient-to-br from-background to-background/80'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col gap-5 flex-wrap md:flex-row justify-between items-start md:items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold'>Dashboard</h1>
            <p className='text-muted-foreground mt-1'>
              Overview of your platform's performance
            </p>
          </div>

          <div className='mt-4 md:mt-0 w-full md:w-auto bg-card rounded-xl p-4 shadow-sm border'>
            <div className='flex flex-col sm:flex-row gap-4 items-end'>
              <div className='flex flex-col gap-2 relative'>
                <span className='text-sm font-medium flex items-center gap-2'>
                  <Calendar size={14} />
                  From
                </span>
                <div className='relative'>
                  <input
                    type='date'
                    value={fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : ''}
                    className='w-full py-2 px-4 text-sm bg-background border border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 rounded-md'
                    onChange={(e) =>
                      setFromDate(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                  />
                  {fromDate && (
                    <button
                      className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                      onClick={() => setFromDate(undefined)}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-2 relative'>
                <span className='text-sm font-medium flex items-center gap-2'>
                  <Calendar size={14} />
                  To
                </span>
                <div className='relative'>
                  <input
                    type='date'
                    value={toDate ? dayjs(toDate).format('YYYY-MM-DD') : ''}
                    className='w-full py-2 px-4 text-sm bg-background border border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 rounded-md'
                    onChange={(e) =>
                      setToDate(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                  />
                  {toDate && (
                    <button
                      className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                      onClick={() => setToDate(undefined)}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className='flex gap-2'>
                <Button
                  variant='default'
                  size='sm'
                  onClick={handleFilterReferrals}
                  disabled={!fromDate && !toDate}
                >
                  Apply Filter
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleResetDate}
                  disabled={!fromDate && !toDate}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isSuccess ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <DashBoardCard
                heading='Total Users'
                number={dashboardData?.totalUser ?? 0}
                // trend={+5.2}
                icon='users'
                color='primary'
              />
              <DashBoardCard
                heading='Total Cars'
                number={dashboardData?.totalCar ?? 0}
                // trend={+12.5}
                icon='cars'
                color='success'
              />
              <DashBoardCard
                heading='Total Bookings'
                number={dashboardData?.totalBooking ?? 0}
                // trend={+8.7}
                icon='BookUser'
                color='warning'
              />
            </div>

            <Tabs defaultValue='users' className='w-full'>
              <TabsList className='mb-6'>
                <TabsTrigger value='users'>User Data</TabsTrigger>
                <TabsTrigger value='cars'>Car Data</TabsTrigger>
                <TabsTrigger value='bookings'>Booking Data</TabsTrigger>
              </TabsList>

              <TabsContent value='users' className='space-y-4'>
                <div className='bg-card rounded-xl p-6 shadow-sm border'>
                  <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-semibold'>User Data</h2>
                    {/* <Badge variant='outline' className='px-3'>
            Last 30 days
          </Badge> */}
                  </div>
                  <Separator className='mb-6' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <DashBoardCard
                      heading='Active Users'
                      number={dashboardData?.activeUser ?? 0}
                      icon='user-check'
                      color='success'
                    />
                    <DashBoardCard
                      heading='Inactive Users'
                      number={dashboardData?.inactiveUser ?? 0}
                      icon='user-x'
                      color='destructive'
                    />
                    <DashBoardCard
                      heading='Total Users'
                      number={dashboardData?.totalUser ?? 0}
                      icon='users'
                      color='primary'
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='cars' className='space-y-4'>
                <div className='bg-card rounded-xl p-6 shadow-sm border'>
                  <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-semibold'>Car Data</h2>
                    {/* <Badge variant='outline' className='px-3'>
            Last 30 days
          </Badge> */}
                  </div>
                  <Separator className='mb-6' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <DashBoardCard
                      heading='Total Cars'
                      number={dashboardData?.totalCar ?? 0}
                      icon='cars'
                      color='primary'
                    />
                    <DashBoardCard
                      heading='Available Cars'
                      number={dashboardData?.totalAvailableCar ?? 0}
                      icon='cars'
                      color='success'
                    />




                  </div>
                </div>
              </TabsContent>

              <TabsContent value='bookings' className='space-y-4'>
                <div className='bg-card rounded-xl p-6 shadow-sm border'>
                  <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-semibold'>booking Data</h2>
                    {/* <Badge variant='outline' className='px-3'>
            Last 30 days
          </Badge> */}
                  </div>
                  <Separator className='mb-6' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <DashBoardCard
                      heading='Total Booking'
                      number={dashboardData?.totalBooking ?? 0}
                      icon='BookUser'
                      color='primary'
                    />

                  </div>
                </div>
              </TabsContent>


            </Tabs>
          </>
        ) : (
          <div className='flex justify-center items-center h-screen'>
            <Loader2 size={40} className='animate-spin text-[#2A9D90]' />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
