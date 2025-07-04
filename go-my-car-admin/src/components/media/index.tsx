import GujjuTraderLogo from '../../assets/gomycar.png';

const GujjuTraderLogoComponent = ({ onClick }) => (
  <div
    className=" w-auto overflow-hidden flex justify-center items-center gap-2 cursor-pointer"
    onClick={onClick}
  >
    <img className="w-[150px] object-cover " src={GujjuTraderLogo} />{' '}
  </div>
);

export { GujjuTraderLogoComponent };
