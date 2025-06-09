import { CircleLoading } from "@/components/loader";
import AuthLayout from "@/layouts/auth/authLayout";

import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const LoginPage = lazy(() => import("@/pages/auth/login"));
const PublicRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: (
      <Suspense
        fallback={
          <div className="h-screen w-full flex justify-center items-center">
            <CircleLoading />
          </div>
        }
      >
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        path: "login",
        element: (
          <>
            <LoginPage />
          </>
        ),
      },
    ],
  },
];

export default PublicRoutes;
