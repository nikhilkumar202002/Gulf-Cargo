"use client";

import { useSearchParams } from "next/navigation";
import OrderDetails from "@/app/components/OrderPage/OrderDetails"; 
import { Suspense } from "react";
import { CgSpinner } from "react-icons/cg";

// Simple loader while reading the URL
const Loader = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <CgSpinner className="animate-spin text-black" size={60} />
      <h2 className="text-xl font-bold text-black">Loading Shipment...</h2>
    </div>
  </div>
);

const ShipmentContent = () => {
  const searchParams = useSearchParams();
  
  // Logic: Specifically look for 'invoice' as requested
  const invoiceId = searchParams.get("invoice") || "";

  // Pass it as 'trackingId' to your existing component
  return <OrderDetails trackingId={invoiceId} />;
};

const ShipmentPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ShipmentContent />
    </Suspense>
  );
};

export default ShipmentPage;