// import Login from "@/pages/sys/login/Login";
// import ProtectedRoute from "@/router/components/protected-route";
// import { usePermissionRoutes } from "@/router/hooks";

import { Navigate, type RouteObject, createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
// import type { AppRouteObject } from "#/router";

import { ERROR_ROUTE } from './errorRoutes';
import DashboardLayout from '@/layouts/dashboard';
import ProtectedRoutes from './protectedRoutes';
import { SidebarProvider as ShadcnSidebarProvider } from '@/components/ui/sidebar';

import PublicRoutes from './publicRoutes';
import ProtectedRoute from './protectedRoute';

// const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

const NO_MATCHED_ROUTE = {
  path: '*',
  element: <Navigate to="/404" replace />,
};

export default function Router() {
  //   const permissionRoutes = usePermissionRoutes();
  //   console.log(permissionRoutes, "permissionRoutes");

  const PROTECTED_ROUTE = {
    path: '/',
    element: (
      <ProtectedRoute>
        <ShadcnSidebarProvider>
          <DashboardLayout />
        </ShadcnSidebarProvider>
      </ProtectedRoute>
    ),
    children: [...ProtectedRoutes],
  };

  const routes = [
    ...PublicRoutes,
    PROTECTED_ROUTE,
    ERROR_ROUTE,
    NO_MATCHED_ROUTE,
  ] as RouteObject[];

  console.log(routes, 'routes');
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}
