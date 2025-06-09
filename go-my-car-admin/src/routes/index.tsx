import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";

import { AuthProvider } from "@/context/authContext";
import ProtectedRoute from "./protectedRoute";
import DashboardLayout from "@/layouts/dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import PublicRoutes from "./publicRoutes";
import ProtectedRoutes from "./protectedRoutes";
import Loader from "@/components/loader/loader";
import { ErrorRoutes } from "./errorRoutes";

// Main Router Component
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            {PublicRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element}>
                {route.children?.map((child, idx) => (
                  <Route key={idx} path={child.path} element={child.element} />
                ))}
              </Route>
            ))}

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <DashboardLayout />
                  </SidebarProvider>
                </ProtectedRoute>
              }
            >
              {ProtectedRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element}>
                  {route.children?.map((child, idx) => (
                    <Route
                      key={idx}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}
            </Route>
            {ErrorRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element}>
                {route.children?.map((child, idx) => (
                  <Route key={idx} path={child.path} element={child.element} />
                ))}
              </Route>
            ))}
            <Route path="*" element={<Navigate to="/404" replace />} />
            {/* Catch-All Route for 404 */}
          </Routes>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
}
