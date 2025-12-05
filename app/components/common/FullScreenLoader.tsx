import { CgSpinner } from "react-icons/cg";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-500">
      <div className="flex flex-col items-center gap-4">
        <CgSpinner className="animate-spin text-black" size={50} />
        {/* Removed animate-pulse to stop blinking */}
        <h2 className="text-xl font-bold text-black">Tracking Shipment...</h2>
      </div>
    </div>
  );
};

export default FullScreenLoader;