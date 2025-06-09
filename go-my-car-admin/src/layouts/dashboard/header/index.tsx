import { SidebarTrigger } from "@/components/ui/sidebar";
import HeaderMenu from "./headerMenu";
import HeaderActions from "./headerActions";

const Header = () => {
  return (
    <div className="h-20 flex items-center px-4 bg-primary shadow-md ">
      <SidebarTrigger variant="secondary" />
      <HeaderMenu />
      <HeaderActions />
    </div>
  );
};

export default Header;
