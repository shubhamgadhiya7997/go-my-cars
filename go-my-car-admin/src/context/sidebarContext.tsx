import { sidebarMenus } from "@/config/sideBarMenu";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the SidebarContext type
interface SidebarContextType {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  sidebarMenus: typeof sidebarMenus;
}

// Create the context with default undefined
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");

  return (
    <SidebarContext.Provider
      value={{ activeMenu, setActiveMenu, sidebarMenus }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use SidebarContext
export const useCustomSidebar = (): SidebarContextType | undefined => {
  const context = useContext(SidebarContext);
  console.log(context, "context");
  if (!context) {
    // throw new Error("useCustomSidebar must be used within a SidebarProvider");
  }
  return context;
};
