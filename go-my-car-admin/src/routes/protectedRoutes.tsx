import Favorite from '@/pages/favorite';
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
const Coupon = lazy(() => import("@/pages/coupon"));
const CouponCreate = lazy(() => import("@/pages/coupon/create/index"));
const CouponUpdate = lazy(() => import("@/pages/coupon/update"));

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

   { path: '/coupon', element: <Coupon /> },
   { path: '/coupon/create', element: <CouponCreate />, },
   { path: '/coupon/view/:id', element: <CouponUpdate /> },
   { path: '/favorite', element: <Favorite /> },
];

export default ProtectedRoutes;
