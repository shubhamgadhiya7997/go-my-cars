import { Outlet } from 'react-router-dom';
import { m } from 'framer-motion';
import Gomycar from '../../assets/gomycar.png';
import GradientBackground from './gradientBackground';
import { ModeToggle } from '@/components/modleToggle';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section - Animated Blue Gradient */}
      <div className="hidden md:flex w-1/2 h-screen relative items-center justify-center overflow-hidden">
        <GradientBackground />
        <m.img
          src={Gomycar}
          alt="Go My Cars"
          className="z-10 w-100 h-80 rounded-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>

      {/* Right Section - Auth Form */}
      <div className="flex w-full md:w-1/2 min-h-screen items-center justify-center p-6">
        <m.div className="w-full max-w-md shadow-lg">
          <Outlet />
        </m.div>
      </div>

      <div className="fixed right-0 top-0 p-4">
        <ModeToggle />
      </div>
    </div>
  );
};

export default AuthLayout;
