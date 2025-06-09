import { GujjuTraderLogoComponent } from '@/components/media';
import { SidebarHeader } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';

const SidebarHeaderComponent = () => {
  const navigate = useNavigate();
  const onHandleClickLogo = () => {
    navigate('/');
  };
  return (
    <SidebarHeader className="bg-primary  text-center font-bold h-20 text-white items-center flex justify-center">
      <GujjuTraderLogoComponent onClick={onHandleClickLogo} />
    </SidebarHeader>
  );
};

export default SidebarHeaderComponent;
