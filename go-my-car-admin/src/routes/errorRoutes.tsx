import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router';

// import { CircleLoading } from "@/components/loading";
// import SimpleLayout from "@/layouts/simple";

// import ProtectedRoute from "../components/protected-route";

// import type { AppRouteObject } from "#/router";

const Page403 = lazy(() => import('@/pages/error/Page403'));
const Page404 = lazy(() => import('@/pages/error/Page404'));
const Page500 = lazy(() => import('@/pages/error/Page500'));

/**
 * error routes
 * 403, 404, 500
 */
export const ErrorRoutes: RouteObject[] = [
  {
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
      { path: '403', element: <Page403 /> },
      { path: '404', element: <Page404 /> },
      { path: '500', element: <Page500 /> },
    ],
  },
];
