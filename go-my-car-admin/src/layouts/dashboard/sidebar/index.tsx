import {
  Sidebar as ShadCnSideBar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Sidebar from "@/layouts/dashboard/sidebar/sideBarMenuItem";
import { sidebarMenus } from "@/config/sideBarMenu";
// import ChallengerLogo from "../../../assets/challengerlogo.png";
import { useCustomSidebar } from "@/context/sidebarContext";
import { SidebarFooterComponent } from "./sideBarFooter";
import SidebarHeaderComponent from "./sideBarHeader";
export function AppSidebar() {
  const { activeMenu } = useCustomSidebar();
  console.log(activeMenu,'activeMenu')
  const menuItems = sidebarMenus[activeMenu] || [];
  // const ChallengerLogoComponent = () => <img src={ChallengerLogo} />;
  return (
    <ShadCnSideBar className="border-none ">
      <SidebarHeaderComponent />
      <SidebarContent>
        <Sidebar menuItems={menuItems} />
      </SidebarContent>
      <SidebarFooterComponent />
    </ShadCnSideBar>
  );
}
