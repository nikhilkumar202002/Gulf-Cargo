"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { IoArrowBack } from "react-icons/io5";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaTruckPlane } from "react-icons/fa6";
import { LuWarehouse } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCheckboxFill } from "react-icons/ri";
import { ImDiamonds } from "react-icons/im";
import { CgSpinner } from "react-icons/cg";
import { fetchSmart } from "../../utils/trackingHelpers"; 
import { motion, Variants } from "framer-motion";
import Adposter from "../../../public/Images/ad-poster.png";
import "./Orderpage.css";
import Image from "next/image";

// --- FULL SCREEN LOADER (Smooth, No Blinking) ---
const FullScreenLoader = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500">
    <div className="flex flex-col items-center gap-4">
      {/* Spinner rotates */}
      <CgSpinner className="animate-spin text-black" size={50} />
      {/* Text is static (removed animate-pulse) */}
      <h2 className="text-xl font-bold text-black">Tracking Shipment...</h2>
    </div>
  </div>
);

// --- CONFIGURATION ---
const TRACKING_WORKFLOW = [
  {
    stageTitle: "Shipment Received",
    icon: BsBoxSeamFill,
    steps: [
      { label: "Shipment Received", ids: [1, 11, 13] }, 
      { label: "Reached Warehouse", ids: [16] },
      { label: "Shipment Booked", ids: [2] },
      { label: "Shipment Forwarded", ids: [3] }
    ]
  },
  {
    stageTitle: "In Transit",
    icon: FaTruckPlane,
    steps: [
      { label: "In Transit", ids: [14, 17, 12] },
      { label: "Arrived at Port", ids: [22] },
      { label: "Waiting for Clearance", ids: [5] }
    ]
  },
  {
    stageTitle: "Arrival & Clearance",
    icon: LuWarehouse,
    steps: [
      { label: "Arrival & Clearance", ids: [18, 4] },
      { label: "Shipment Cleared", ids: [19, 7] },
      { label: "Shipment on Hold", ids: [6] },
      { label: "Booking in Progress", ids: [20] },
      { label: "In Transit", ids: [21] }
    ]
  },
  {
    stageTitle: "Out for Delivery",
    icon: TbTruckDelivery,
    steps: [
      { label: "Out for Delivery", ids: [8, 9] },
      { label: "Not Delivered", ids: [10], isError: true }
    ]
  },
  {
    stageTitle: "Delivered",
    icon: RiCheckboxFill,
    steps: [
      { label: "Delivered", ids: [15] }
    ]
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const OrderDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackingId = searchParams.get("invoice") || searchParams.get("shipment") || searchParams.get("track") || searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [expandedStep, setExpandedStep] = useState<number>(-1);

  // --- FETCH DATA ---
  useEffect(() => {
    if (!trackingId) { setLoading(false); return; }
    
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        // --- 3 SECOND DELAY LOGIC ---
        // Forces the loader to stay visible for at least 3 seconds
        const minLoaderTime = new Promise(resolve => setTimeout(resolve, 3000));
        
        const [result] = await Promise.all([
            fetchSmart(trackingId),
            minLoaderTime
        ]);
        
        let cleanData = result;
        if (cleanData && cleanData.data) cleanData = cleanData.data;
        if (Array.isArray(cleanData)) cleanData = cleanData.length > 0 ? cleanData[0] : null;
        if (cleanData && cleanData.data) cleanData = cleanData.data;
        if (Array.isArray(cleanData)) cleanData = cleanData.length > 0 ? cleanData[0] : null;

        if (!cleanData) throw new Error("No shipment data found.");
        
        if (result && result.success === false) throw new Error(result.message || "Shipment not found");
        
        setData(cleanData);
      } catch (err: any) {
        let msg = "Tracking details not found.";
        try {
           if (err.message.includes('{')) {
              const parsed = JSON.parse(err.message.replace(/.*?(\{.*\})/, '$1'));
              if (parsed.message) msg = parsed.message;
           } else { msg = err.message; }
        } catch {}
        setError(msg);
      } finally { setLoading(false); }
    };
    loadData();
  }, [trackingId]);

  // --- CALCULATE ACTIVE STATE ---
  const { activeStageIndex, activeStepIndex, currentStatusLabel } = useMemo(() => {
    if (!data) return { activeStageIndex: 0, activeStepIndex: 0, currentStatusLabel: "Processing..." };

    let rawId = data.status_id ?? data.statusId ?? data.id ?? data.current_status_id;
    if (!rawId && data.status && !isNaN(Number(data.status))) {
        rawId = data.status;
    }
    const currentIdString = String(rawId || 0); 

    for (let i = 0; i < TRACKING_WORKFLOW.length; i++) {
      const stage = TRACKING_WORKFLOW[i];
      for (let j = 0; j < stage.steps.length; j++) {
        const step = stage.steps[j];
        if (step.ids.some(id => String(id) === currentIdString)) {
           return { activeStageIndex: i, activeStepIndex: j, currentStatusLabel: step.label };
        }
      }
    }

    const rawText = (data.status_name || data.status || "").toString().toLowerCase().trim();
    if (isNaN(Number(rawText))) {
        for (let i = 0; i < TRACKING_WORKFLOW.length; i++) {
            const stage = TRACKING_WORKFLOW[i];
            for (let j = 0; j < stage.steps.length; j++) {
                const stepLabel = stage.steps[j].label.toLowerCase();
                if (rawText.includes(stepLabel) || stepLabel.includes(rawText)) {
                    return { activeStageIndex: i, activeStepIndex: j, currentStatusLabel: stage.steps[j].label };
                }
            }
        }
    }

    return { activeStageIndex: 0, activeStepIndex: 0, currentStatusLabel: data.status_name || "Shipment Received" };
  }, [data]);

  useEffect(() => {
    if (data) setExpandedStep(activeStageIndex);
  }, [activeStageIndex, data]);

  const handleBack = () => router.back();
  const displayCode = data?.invoice_no || data?.tracking_code || data?.tracking_no || trackingId;
  const method = data?.shipment_method || data?.method || 'Standard';
  const lastUpdate = data?.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'Just now';

  const getHeaderBadgeColor = () => {
      if (activeStageIndex === 4) return "bg-green-100 text-green-700 border-green-200"; 
      return "bg-blue-50 text-blue-600 border-blue-200"; 
  };

  if (loading) return <FullScreenLoader />;

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
                  {currentStatusLabel}
                </div>
              </div>
            </motion.div>

            {/* TRACKING TIMELINE */}
            <motion.div 
               className="order-page-trackings grid grid-cols-[50px_1fr]"
               variants={containerVariants}
               initial="hidden"
               animate="show"
            >
                {TRACKING_WORKFLOW.map((stage, sIndex) => {
                  const Icon = stage.icon;
                  const isStagePast = sIndex < activeStageIndex;
                  const isStageActive = sIndex === activeStageIndex;
                  
                  let iconClass = "order-page-tracking-icon"; 
                  let iconStyle = {};
                  let textStyle = { fontSize: '1.1rem' };

                  if (isStagePast || isStageActive) {
                      iconStyle = { backgroundColor: "#e6f4ea", color: "#00925d" }; 
                      textStyle = { ...textStyle, color: "black", fontWeight: "600" };
                  } else {
                      iconStyle = { backgroundColor: "#f3f4f6", color: "#9ca3af" };
                      textStyle = { ...textStyle, color: "#9ca3af", fontWeight: "500" };
                  }

                  const isExpanded = sIndex === expandedStep;
                  const showLine = sIndex !== TRACKING_WORKFLOW.length - 1;

                  return (
                    <motion.div key={sIndex} className="contents" variants={itemVariants}>
                      
                      {/* COL 1: Icon */}
                      <div className="relative flex flex-col items-center">
                        {showLine && (
                           <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l-2 border-dashed border-gray-300 -translate-x-1/2 z-0"></div>
                        )}
                        <div 
                          className={`cursor-pointer transition-all z-10 ${iconClass} shadow-sm border border-white`} 
                          style={iconStyle}
                          onClick={() => setExpandedStep(isExpanded ? -1 : sIndex)}
                        >
                          <Icon />
                        </div>
                      </div>

                      {/* COL 2: Title & "In Progress" Bar */}
                      <div className="flex flex-col justify-center pb-8 pl-4 cursor-pointer" onClick={() => setExpandedStep(isExpanded ? -1 : sIndex)}>
                          <div className="flex flex-col gap-1">
                            <h5 style={textStyle}>{stage.stageTitle}</h5>

                          </div>
                      </div>

                      {/* SUB-STEPS */}
                      {isExpanded && (
                        <>
                           {stage.steps.map((subStep, stepIndex) => {
                              let stepColor = "#9ca3af"; 
                              let isBlinking = false;
                              let isErrorText = subStep.isError || false;

                              if (isStagePast) {
                                  stepColor = "#00925d"; 
                              } else if (isStageActive) {
                                  if (stepIndex < activeStepIndex) {
                                      stepColor = "#00925d"; 
                                  } else if (stepIndex === activeStepIndex) {
                                      stepColor = activeStageIndex === 4 ? "#00925d" : "#ef4444"; 
                                      isBlinking = activeStageIndex !== 4;
                                  }
                              }

                              if (activeStageIndex === 4 && stepIndex === activeStepIndex) {
                                 isBlinking = true; 
                              }

                              if (isErrorText && stepIndex === activeStepIndex && isStageActive) {
                                  stepColor = "#ef4444";
                              }

                              return (
                                <motion.div 
                                    key={`sub-${sIndex}-${stepIndex}`} 
                                    className="contents"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                  {/* Inner Icon */}
                                  <div className="relative flex flex-col items-center justify-center">
                                    <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l-2 border-dashed border-gray-300 -translate-x-1/2 z-0"></div>
                                    <div className="relative z-10 flex items-center justify-center w-6 h-6">
                                       {isBlinking && (
                                         <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${activeStageIndex === 4 ? 'bg-green-200' : 'bg-red-200'}`}></span>
                                       )}
                                       <div className={`relative z-10 bg-white p-0.5`} style={{ color: stepColor }}>
                                          <ImDiamonds size={14} />
                                       </div>
                                    </div>
                                  </div>

                                  {/* Text */}
                                  <div className="flex items-center flex-wrap gap-2 pb-4 pl-4">
                                     <h5 className={`text-sm font-medium`} style={{ color: (isErrorText && isBlinking) ? "#ef4444" : "#374151" }}>
                                        {subStep.label}
                                     </h5>
                                     
                                     {isStageActive && stepIndex === activeStepIndex && (
                                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold text-white rounded-md ${activeStageIndex === 4 ? 'bg-green-500' : 'bg-red-500'}`}>
                                          Latest
                                        </span>
                                     )}

                                     {isStageActive && stepIndex === activeStepIndex && (
                                        <span className="text-gray-400 text-xs ml-2 border-l pl-2 border-gray-300">
                                            {lastUpdate}
                                        </span>
                                     )}
                                  </div>
                                </motion.div>
                              );
                           })}
                           
                           <div className="contents">
                              <div className="relative">
                                  {sIndex !== TRACKING_WORKFLOW.length - 1 && (
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
              priority={true} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;