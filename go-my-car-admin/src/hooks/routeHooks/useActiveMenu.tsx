import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { sidebarMenus } from "@/config/sideBarMenu";
import { useCustomSidebar } from "@/context/sidebarContext";

// Define the type for a menu item
interface MenuItem {
  path?: string;
  children?: MenuItem[];
}

// Recursive function to find the active menu based on the current path
const findActiveMenu = (
  menus: Record<string, MenuItem[]>,
  path: string
): string | null => {
  for (const [menuKey, items] of Object.entries(menus)) {
    for (const item of items) {
      if (item.path === path) return menuKey;
      if (item.children) {
        const found = findActiveMenu({ [menuKey]: item.children }, path);
        if (found) return menuKey;
      }
    }
  }
  return null;
};

// Custom hook to determine and set the active menu
export const useActiveMenu = (): void => {
  const location = useLocation();
  const { setActiveMenu } = useCustomSidebar();

  const activeMenu = useMemo(
    () => findActiveMenu(sidebarMenus, location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    if (activeMenu) setActiveMenu(activeMenu);
  }, [activeMenu, setActiveMenu]);
};
