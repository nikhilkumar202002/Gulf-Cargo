"use client";

import { IoArrowBack } from "react-icons/io5";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaTruckPlane } from "react-icons/fa6";
import { LuWarehouse } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCheckboxFill } from "react-icons/ri";
import { ImDiamonds } from "react-icons/im";
import "./Orderpage.css";

const OrderDetails = () => {
  return (
    <>
      <section className="order-page">
        <div className="order-page-container container">
          <div className="order-page-flex grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            <div className="order-page-details">
              <div className="order-page-details-header">
                <h3 className="flex items-center gap-1">
                  <span>
                    <IoArrowBack />
                  </span>
                  Back
                </h3>
              </div>

            
              <div className="order-details-header">
                <h2>
                  INVOICE NUMBER: <span></span>
                </h2>
                <h3>
                  SHIPMENT METHOD: <span></span>
                </h3>
              </div>

              <div className="order-page-trackings">
                <div className="order-page-tracking-outer">
                  <div>
                    <div className="order-page-tracking-inner">
                      <div className="order-page-tracking-icon">
                        <BsBoxSeamFill />
                      </div>
                      <div className="tracking-status">
                        <h5>Shipment Booked</h5>
                      </div>
                    </div>
                    <div className="order-page-status-details">
                      <div className="status-details-icon">
                        <ImDiamonds />
                      </div>
                      <div className="status-details-header">
                        <h5>Reached at Ware house</h5>
                      </div>
                    </div>
                    <div className="order-page-status-details">
                      <div className="status-details-icon">
                        <ImDiamonds />
                      </div>
                      <div className="status-details-header">
                        <h5>Shipment Booked</h5>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="order-page-tracking-inner">
                      <div className="order-page-tracking-icon">
                        <FaTruckPlane />
                      </div>
                      <div className="tracking-status">
                        <h5>In Transit</h5>
                      </div>
                    </div>

                    <div className="order-page-status-details">
                      <div className="status-details-icon">
                        <ImDiamonds />
                      </div>
                      <div className="status-details-header">
                        <h5>Arrived at Port</h5>
                      </div>
                    </div>
                    <div className="order-page-status-details">
                      <div className="status-details-icon">
                        <ImDiamonds />
                      </div>
                      <div className="status-details-header">
                        <h5>Waitng for Clearance</h5>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="order-page-tracking-inner">
                      <div className="order-page-tracking-icon">
                        <LuWarehouse />
                      </div>
                      <div className="tracking-status">
                        <h5>Arival & Clearance</h5>
                      </div>
                    </div>

                    <div className="order-page-status-details">
                      <div className="status-details-icon">
                        <ImDiamonds />
                      </div>
                      <div className="status-details-header">
                        <h5>Cleared</h5>
                      </div>
                    </div>
                    <div className="order-page-status-details">
                      <div className="status-details-icon">
                        <ImDiamonds />
                      </div>
                      <div className="status-details-header">
                        <h5>Booking for Clearance</h5>
                      </div>
                    </div>
                    <div className="order-page-status-details">
                      <div className="status-details-icon">
                        <ImDiamonds />
                      </div>
                      <div className="status-details-header">
                        <h5>In Transit</h5>
                      </div>
                    </div>
                  </div>

                  <div className="order-page-tracking-inner">
                    <div className="order-page-tracking-icon">
                      <TbTruckDelivery />
                    </div>
                    <div className="tracking-status">
                      <h5>Out of Delivery</h5>
                    </div>
                  </div>

                  <div className="order-page-tracking-inner">
                    <div className="order-page-tracking-icon">
                      <RiCheckboxFill />
                    </div>
                    <div className="tracking-status">
                      <h5>Delivered</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-page-contact">
                <h3>Get Help ?</h3>
                <p>
                  <a href="#">+966 54 761 9393</a>,{" "}
                  <a href="#">+966 54 314 5105</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderDetails;
