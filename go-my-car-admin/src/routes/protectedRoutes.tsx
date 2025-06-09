import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const DashBoard = lazy(() => import('@/pages/dashboard'));
const Users = lazy(() => import('@/pages/users'));
const Cars = lazy(() => import('@/pages/cars'));
const Banner = lazy(() => import('@/pages/banner'));
const BannerCreate = lazy(() => import('@/pages/banner/create'));
const BannerUpdate = lazy(() => import('@/pages/banner/update'));

const CreateCars = lazy(() => import('@/pages/cars/create'));
const UpdateCars = lazy(() => import('@/pages/cars/update'));
const Booking = lazy(() => import('@/pages/booking'));
const Setting = lazy(() => import('@/pages/setting/home'));
const Support = lazy(() => import('@/pages/support'));
const SupportView = lazy(() => import('@/pages/support/update'));
const Partner = lazy(() => import('@/pages/partner'));
const PartnerView = lazy(() => import('@/pages/partner/update'));
const Notifications = lazy(() => import('@/pages/notifications'));
const CreateNotification = lazy(() => import('@/pages/notifications/create'));


// const ProtectedRoutes: RouteObject[] = [
//   { path: '/', element: <DashBoard /> },
//   { path: '/completed-jobs', element: <Jobs /> },
//   { path: '/jobs', element: <Jobs /> },
//   { path: '/jobs/empty', element: <EmptyJobs /> },
//   { path: '/jobs/completed', element: <CompletedJobs /> },
//   { path: '/jobs/search', element: <SearchJobs /> },
//   { path: '/cabhistory', element: <CabHistory /> },
//   { path: '/spareparts', element: <SpareParts /> },
//   { path: '/inventory/used', element: <UsedSpareParts /> },
//   { path: '/inventory/new', element: <NewSpareParts /> },
//   { path: '/inventory/return', element: <SparePartsReturn /> },
//   { path: '/inventory/purchase', element: <SparePartsPurchase /> },
//   { path: '/inventory/purchase-return', element: <PurchaseReturn /> },
//   { path: '/memo', element: <Memo /> },
//   { path: '/cars', element: <Cars /> },
//   { path: '/accounts', element: <Accounts /> },
//   { path: '/accounts/statements', element: <AccountStatements /> },
//   { path: '/accounts/ledger', element: <GeneralLedger /> },
//   { path: '/accounts/supplier-payment', element: <SupplierPayment /> },
//   { path: '/accounts/invoices', element: <PostingInvoices /> },
//   { path: '/accounts/expenses', element: <UserExpenses /> },
//   { path: '/hrms/employee', element: <AddEmployee /> },
//   { path: '/hrms/payroll', element: <GeneralPayroll /> },
//   { path: '/hrms/announcements', element: <Announcements /> },
//   { path: '/hrms/holidays', element: <Holidays /> },
//   { path: '/customers', element: <Customers /> },
//   { path: '/reports', element: <Reports /> },
//   { path: '/settings', element: <Settings /> },
// ];
const ProtectedRoutes: RouteObject[] = [
  { path: '/', element: <DashBoard /> },
  { path: '/users', element: <Users /> },
  { path: '/car', element: <Cars /> },
  { path: '/car/create', element: <CreateCars /> },
  { path: '/car/view/:id', element: <UpdateCars /> },
  { path: '/banner', element: <Banner /> },
  { path: '/banner/create', element: <BannerCreate />, },
  { path: '/banner/view/:id', element: <BannerUpdate /> },
  { path: '/booking', element: <Booking /> },
  { path: '/setting', element: <Setting /> },
  { path: '/support', element: <Support /> },
  { path: '/support/view/:id', element: <SupportView /> },
  { path: '/partner', element: <Partner /> },
  { path: '/partner/view/:id', element: <PartnerView /> },
 {
    path: '/notifications',
    element: <Notifications />,
  },
  {
    path: '/notifications/create',
    element: <CreateNotification />,
  },
];

export default ProtectedRoutes;
