"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaTruckPlane } from "react-icons/fa6";
import { LuWarehouse } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCheckboxFill } from "react-icons/ri";
import { ImDiamonds } from "react-icons/im";
import { fetchSmart } from "../../utils/trackingHelpers"; 
// 1. Import Variants here
import { motion, Variants } from "framer-motion";
import Adposter from "../../../public/Images/ad-poster.png";
import "./Orderpage.css";
import Image from "next/image";

// --- 1. VISUAL STAGES ---
const STAGES = [
  { key: 'received',          title: 'Shipment Received' },   // Stage 0
  { key: 'in_transit',        title: 'In Transit' },          // Stage 1
  { key: 'arrival_clearance', title: 'Arrival & Clearance' }, // Stage 2
  { key: 'out_delivery',      title: 'Out for Delivery' },    // Stage 3
  { key: 'delivered',         title: 'Delivered' },           // Stage 4
];

const DESIGN_ICONS = [
  BsBoxSeamFill,   // 0
  FaTruckPlane,    // 1
  LuWarehouse,     // 2
  TbTruckDelivery, // 3
  RiCheckboxFill   // 4
];

// --- 2. STATIC HISTORY ---
const COMPLETED_SUB_STEPS = [
  ["Reached Warehouse", "Shipment Booked"], 
  ["Arrived at port", "Waiting for clearance"], 
  ["Cleared", "Booking in process", "Delivery in transit"], 
  [], 
  [] 
];

// --- 3. STATUS ID LIBRARY ---
const STATUS_LIBRARY: Record<number, { text: string; stage: number }> = {
  1:  { text: "Shipment Received",   stage: 0 },
  2:  { text: "Shipment Booked",     stage: 0 },
  3:  { text: "Shipment Forwarded",  stage: 0 }, 
  11: { text: "Pending",             stage: 0 },
  13: { text: "Enquiry Collected",   stage: 0 },
  18: { text: "Reached Warehouse",   stage: 0 },
  5:  { text: "Waiting for Clearance", stage: 1 }, 
  12: { text: "More Tracking",         stage: 1 },
  14: { text: "Transfer",              stage: 1 },
  19: { text: "In Transit",            stage: 1 },
  24: { text: "Arrived at Port",       stage: 1 },
  4:  { text: "Shipment Arrived",      stage: 2 },
  6:  { text: "Shipment on Hold",      stage: 2 },
  7:  { text: "Shipment Cleared",      stage: 2 },
  20: { text: "Arrival & Clearance",   stage: 2 },
  21: { text: "Customs Cleared",       stage: 2 },
  22: { text: "Booking in Progress",   stage: 2 },
  23: { text: "Delivery in Transit",   stage: 2 },
  8:  { text: "Delivery Arranged",         stage: 3 },
  9:  { text: "Shipment Out for Delivery", stage: 3 },
  10: { text: "Not Delivered",             stage: 3 },
  15: { text: "Delivered",             stage: 4 }
};

// --- FRAMER VARIANTS ---
// 2. Add type annotations to your variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

// --- DATA TYPE ---
interface ShipmentData {
  status_name?: string;
  status?: string | number;
  status_id?: number | string;
  statusId?: number | string;
  invoice_no?: string;
  tracking_code?: string;
  tracking_no?: string;
  shipment_method?: string;
  method?: string;
  updated_at?: string;
  // allow other fields
  [key: string]: unknown;
}

// --- PROPS INTERFACE ---
interface OrderDetailsProps {
  trackingId: string;
  searchType?: string; // Kept in interface to prevent parent errors, but unused here
}

const OrderDetails = ({ trackingId }: OrderDetailsProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ShipmentData | null>(null);
  const [error, setError] = useState("");
  const [expandedStep, setExpandedStep] = useState<number>(-1);

  // --- FETCH DATA ---
  useEffect(() => {
    // If no ID passed, stop loading
    if (!trackingId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        // We use the trackingId prop directly here
        const result = await fetchSmart(trackingId);
        
        const actualData = result.data || result; 
        if (result && result.success === false) throw new Error(result.message || "Shipment not found");
        
        setData(actualData);
      } catch (err: unknown) {
        let msg = "Tracking details not found.";
        
        // Safe type narrowing
        if (err instanceof Error) {
            try {
                if (err.message.includes('{')) {
                    const parsed = JSON.parse(err.message.replace(/.*?(\{.*\})/, '$1'));
                    if (parsed.message) msg = parsed.message;
                } else {
                    msg = err.message;
                }
            } catch {
                msg = err.message;
            }
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [trackingId]); // Depend on trackingId prop

  // --- CALCULATE STAGE ---
  const { stageIndex, statusName } = useMemo(() => {
    if (!data) return { stageIndex: 0, statusName: "Processing..." };

    let rawText = (data.status_name || data.status || "").toString().trim();
    rawText = rawText.replace(/&amp;/g, "&"); 
    const text = rawText.toLowerCase();

    let id = Number(data.status_id || data.statusId || 0);
    if (id === 0 && !isNaN(Number(rawText)) && rawText.length < 4) id = Number(rawText);

    if (STATUS_LIBRARY[id]) {
      return { stageIndex: STATUS_LIBRARY[id].stage, statusName: STATUS_LIBRARY[id].text };
    }

    if (text.includes("delivered") && !text.includes("not") && !text.includes("out") && !text.includes("transit")) return { stageIndex: 4, statusName: rawText };
    if (text.includes("out for") || text.includes("delivery arranged")) return { stageIndex: 3, statusName: rawText };
    if (text.includes("cleared") || text.includes("booking") || text.includes("arrival") || (text.includes("transit") && text.includes("delivery"))) return { stageIndex: 2, statusName: rawText };
    if (text.includes("port") || text.includes("waiting for clearance") || text.includes("transit") || text.includes("transfer")) return { stageIndex: 1, statusName: rawText };
    if (text.includes("receiv") || text.includes("warehouse") || text.includes("book") || text.includes("forward") || text.includes("pending")) return { stageIndex: 0, statusName: rawText };

    return { stageIndex: 0, statusName: rawText || "Shipment Received" };
  }, [data]);

  useEffect(() => {
    if (data) setExpandedStep(stageIndex);
  }, [stageIndex, data]);

  const handleBack = () => router.back();
  
  // Provide fallbacks for display
  const displayCode = data?.invoice_no || data?.tracking_code || data?.tracking_no || trackingId;
  const method = data?.shipment_method || data?.method || 'Standard';
  const lastUpdate = data?.updated_at ? new Date(data.updated_at as string).toLocaleDateString() : 'Just now';

  const getHeaderBadgeColor = () => {
      if (stageIndex === 4) return "bg-green-100 text-green-700 border-green-200"; 
      return "bg-blue-50 text-blue-600 border-blue-200"; 
  };

  // --- SKELETON LOADING COMPONENT ---
  if (loading) return (
    <div className="order-page container pt-20">
       <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div>
             <div className="h-6 w-20 bg-gray-200 rounded mb-8 animate-pulse"></div>
             {/* Header Skeleton */}
             <div className="p-6 rounded-2xl bg-gray-50 mb-8 border border-gray-100">
                <div className="flex justify-between items-center">
                   <div className="space-y-3">
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                   </div>
                   <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
             </div>
             {/* Timeline Skeleton */}
             <div className="space-y-8 pl-4">
                {[1, 2, 3, 4, 5].map((i) => (
                   <div key={i} className="flex items-center gap-6">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 animate-pulse"></div>
                      <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error} <br/><button onClick={handleBack} className="underline mt-4 text-black">Go Back</button></div>;

  return (
    <section className="order-page">
      <div className="order-page-container container">
        <div className="order-page-flex grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div className="order-page-details">
            
            <div className="order-page-details-header cursor-pointer" onClick={handleBack}>
              <h3 className="flex items-center gap-1"><span><IoArrowBack /></span> Back</h3>
            </div>

            {/* HEADER */}
            <motion.div 
               initial={{ opacity: 0, y: -20 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="order-details-header relative mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2>INVOICE: <span>{displayCode}</span></h2>
                  <h3>METHOD: <span>{method}</span></h3>
                </div>
                <div className={`px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wide w-fit ${getHeaderBadgeColor()}`}>
                  {statusName}
                </div>
              </div>
            </motion.div>

            {/* TRACKING TIMELINE - Wrapped in Motion */}
            <motion.div 
               className="order-page-trackings grid grid-cols-[50px_1fr]"
               variants={containerVariants}
               initial="hidden"
               animate="show"
            >
                
                {STAGES.map((stage, index) => {
                  const Icon = DESIGN_ICONS[index] || BsBoxSeamFill;
                  
                  const isPast = index < stageIndex;
                  const isCurrent = index === stageIndex;
                  const isNext = index === stageIndex + 1;
                  const isVisuallyGreen = isPast || isCurrent;
                  
                  const hideSubSteps = ['out_delivery', 'delivered'].includes(stage.key);
                  const isExpanded = index === expandedStep && !hideSubSteps;

                  const iconClass = "order-page-tracking-icon"; 
                  let iconStyle: React.CSSProperties = {};
                  let textStyle: React.CSSProperties = { fontSize: '1.1rem' };

                  if (isVisuallyGreen) {
                      iconStyle = { backgroundColor: "#e6f4ea", color: "#00925d" }; 
                      textStyle = { ...textStyle, color: "black", fontWeight: "600" };
                  } else if (isNext) {
                      iconStyle = { backgroundColor: "#fee2e2", color: "#ef4444" }; 
                      textStyle = { ...textStyle, color: "#ef4444", fontWeight: "700" }; 
                  } else {
                      iconStyle = { backgroundColor: "#f3f4f6", color: "#9ca3af" };
                      textStyle = { ...textStyle, color: "#9ca3af", fontWeight: "500" };
                  }

                  const showLine = index !== STAGES.length - 1;

                  return (
                    <motion.div key={stage.key} className="contents" variants={itemVariants}>
                      
                      {/* --- COL 1: Icon & Line --- */}
                      <div className="relative flex flex-col items-center">
                        {showLine && (
                           <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l-2 border-dashed border-gray-300 -translate-x-1/2 z-0"></div>
                        )}
                        <div 
                          className={`cursor-pointer transition-all z-10 ${iconClass} shadow-sm border border-white`} 
                          style={iconStyle}
                          onClick={() => setExpandedStep(isExpanded ? -1 : index)}
                        >
                          <Icon />
                        </div>
                      </div>

                      {/* --- COL 2: Title & Badges --- */}
                      <div className="flex flex-col justify-center pb-8 pl-4 cursor-pointer" onClick={() => setExpandedStep(isExpanded ? -1 : index)}>
                          <div className="flex items-center flex-wrap gap-3">
                            <h5 style={textStyle}>{stage.title}</h5>
                            
                            {isCurrent && (
                                <span className="px-2 py-1 text-[10px] uppercase font-bold text-green-700 bg-green-100 border border-green-200 rounded-md">
                                  Latest
                                </span>
                            )}

                            {isNext && (
                                <span className="px-2 py-1 text-[10px] uppercase font-bold text-red-700 bg-red-100 border border-red-200 rounded-md">
                                  In Progress
                                </span>
                            )}
                          </div>
                      </div>

                      {/* --- COL 3: SUB-STEPS (Details) --- */}
                      {isExpanded && (
                        <>
                           {isVisuallyGreen && COMPLETED_SUB_STEPS[index]?.map((subEvent, i) => (
                              subEvent.toLowerCase() !== statusName.toLowerCase() && (
                                <motion.div 
                                    key={`hist-${i}`} 
                                    className="contents"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                  <div className="relative flex flex-col items-center justify-center">
                                    <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l-2 border-dashed border-gray-300 -translate-x-1/2 z-0"></div>
                                    <div className="status-details-icon z-10 bg-white" style={{ color: "#00925d" }}>
                                      <ImDiamonds size={12} />
                                    </div>
                                  </div>
                                  <div className="flex items-center pb-4 pl-4">
                                     <h5 className="text-gray-700 font-medium text-sm">{subEvent}</h5>
                                  </div>
                                </motion.div>
                              )
                           ))}

                           {isCurrent && (
                                <motion.div 
                                    className="contents"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                   <div className="relative flex flex-col items-center">
                                      <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l-2 border-dashed border-gray-300 -translate-x-1/2 z-0"></div>
                                      <div className="status-details-icon z-10 bg-white" style={{ color: "#00925d" }}>
                                         <ImDiamonds size={12} />
                                      </div>
                                   </div>
                                   <div className="pb-4 pl-4 flex flex-col justify-center">
                                      <h5 className="text-black font-bold text-sm">{statusName}</h5>
                                      <span className="text-gray-400 text-xs mt-1">Updated: {lastUpdate}</span>
                                   </div>
                                </motion.div>
                           )}
                           
                           <div className="contents">
                              <div className="relative">
                                  {index !== STAGES.length - 1 && (
                                     <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l-2 border-dashed border-gray-300 -translate-x-1/2 z-0"></div>
                                  )}
                              </div>
                              <div className="h-6"></div> 
                           </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}

            </motion.div>

            <div className="order-page-contact mt-10 p-6 bg-gray-50 rounded-xl">
              <h3>Need Help?</h3>
              <p>
                <a href="tel:+966547619393" className="text-blue-600 font-bold hover:underline">+966 54 761 9393</a>
              </p>
            </div>
          </div>

          <div className="order-page-ad hidden md:block w-full">
            <Image 
              src={Adposter} 
              alt="Gulcargoksa" 
              className="rounded-2xl"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;