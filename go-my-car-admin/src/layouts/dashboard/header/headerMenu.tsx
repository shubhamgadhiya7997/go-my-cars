import { menuItems } from "@/config/headerMenu";

import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useCustomSidebar } from "@/context/sidebarContext";

const HeaderMenu = () => {
  const { setActiveMenu, activeMenu } = useCustomSidebar();
  const navigate = useNavigate();

  // Memoizing the menu items to prevent unnecessary re-renders
  const memoizedMenuItems = useMemo(() => {
    return menuItems?.map(({ name, icon: Icon, path }) => {
      const isActive = name === activeMenu;
console.log("isActive", isActive)


      return (
        <div
          key={name}
          className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md cursor-pointer transition-all duration-300 shrink-0 
                      ${
                        isActive
                          ? "bg-white text-primary"
                          : "text-white hover:bg-blue-800/60"
                      } sm:w-auto min-w-20`}
          onClick={() => {
            setActiveMenu(name);
            navigate(path);
          }}
        >
          <Icon
            className={`w-6 h-6 transition-transform duration-200 sm:scale-100 scale-90 
                        ${
                          isActive
                            ? "text-primary"
                            : "text-gray-200 hover:text-white"
                        }`}
          />
          <span
            className={`text-xs font-semibold tracking-wide transition-opacity duration-200 
                        ${
                          isActive ? "text-primary" : ""
                        } sm:opacity-100 opacity-80`}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
        </div>
      );
    });
  }, [activeMenu, navigate, setActiveMenu]);
console.log("memoizedMenuItems", memoizedMenuItems)
  return (
    <div className="flex-1 flex items-center overflow-hidden px-3">
      <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        {memoizedMenuItems}
      </div>
    </div>
  );
};

export default HeaderMenu;
