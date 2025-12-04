"use client";

import { useSearchParams } from "next/navigation";
import OrderDetails from "../components/OrderPage/OrderDetails"; // Check this path matches your folder structure
import { Suspense } from "react";

const OrderPageContent = () => {
  const searchParams = useSearchParams();
  
  // Logic: Read 'id'. If not found, check 'track' just in case of old links.
  const id = searchParams.get("id") || searchParams.get("track") || "";
  const type = searchParams.get("type") || "tracking";

  return <OrderDetails trackingId={id} searchType={type} />;
};

const Page = () => {
  return (
    // Suspense is required for useSearchParams in Next.js
    <Suspense fallback={<div className="pt-20 text-center">Loading search...</div>}>
      <OrderPageContent />
    </Suspense>
  );
};

export default Page;