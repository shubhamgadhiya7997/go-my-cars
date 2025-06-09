import { Suspense, useEffect } from "react";
import Main from "./main";
import Header from "./header";

import { CircleLoading } from "@/components/loader";
import { useActiveMenu } from "@/hooks/routeHooks/useActiveMenu";
import { AppSidebar } from "./sidebar";
import { SidebarProvider as ShadcnSidebarProvider } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/context/sidebarContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

const DashboardLayout = () => {
  useActiveMenu();
  return (
    <div className="flex h-screen overflow-hidden flex-1 fixed w-full ">
      <AppSidebar />
      <div className="flex flex-1 flex-col w-full h-screen overflow-hidden">
        <Header />
        {/* <Suspense fallback={<CircleLoading />}> */}
        <div className="flex-1 p-5 overflow-auto ">
          <Main />
        </div>
        {/* </Suspense> */}
      </div>
    </div>
  );
};

export default DashboardLayout;
