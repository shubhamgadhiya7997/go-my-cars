import { useState } from "react";
import { m } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const SidebarItem = ({ title, icon: Icon, onClick, isOpen, isActive }) => (
  <button
    className={cn(
      "flex w-full items-center justify-between p-2 text-left rounded-md transition-all duration-200",
      isActive ? "bg-primary text-white" : "hover:bg-secondary dark:hover:bg-gray-800",
     
    )}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5" />}
      <span className="text-sm">{title}</span>
    </div>
    {isOpen !== undefined &&
      (isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
  </button>
);

const Submenu = ({ items, isOpen, currentPath }) => (
  <m.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="overflow-hidden"
  >
    <div className="ml-3 mt-1 space-y-2">
      {items.map((item) => (
        <SidebarMenu key={item.key} item={item} currentPath={currentPath} />
      ))}
    </div>
  </m.div>
);

const SidebarMenu = ({ item, currentPath }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = currentPath === item.path; // Check if the current route matches the item path

  return (
    <div>
      {item.children ? (
        <SidebarItem
          title={item.name}
          icon={item.icon}
          onClick={() => setIsOpen(!isOpen)}
          isOpen={isOpen}
          isActive={isActive}
        />
      ) : (
        <Link to={item.path} className="block py-2 rounded-md">
          <SidebarItem title={item.name} icon={item.icon} isActive={isActive} />
        </Link>
      )}
      {item.children && <Submenu items={item.children} isOpen={isOpen} currentPath={currentPath} />}
    </div>
  );
};

const Sidebar = ({ menuItems }) => {
  const location = useLocation(); // Get current route
  return (
    <div className="w-64 bg-white dark:bg-gray-900 p-4 h-screen overflow-y-auto border-r">
      {menuItems.map((item) => (
        <SidebarMenu key={item.key} item={item} currentPath={location.pathname} />
      ))}
    </div>
  );
};

export default Sidebar;
