'use client'

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog'; // Import Dialog from Radix UI
import { MdOutlineLocationOn } from "react-icons/md";
import { Button } from '@heroui/react';  // Import Button from Hero UI
import { Package, Truck, MapPin, CheckCircle2, Clock } from "lucide-react"

import "./TrackfromStyles.css"

export default function TrackingForm() {

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="tracking-form-box w-full max-w-md bg-white shadow-lg p-8 mx-auto relative">
      <Tabs.Root defaultValue="trackorder">
        <Tabs.List
          className="tracking-tabs tracking-shipping-tabs flex gap-5 mb-5"
          aria-label="Tracking Types"
        >
          <Tabs.Trigger
            value="trackorder"
            className="tracking-tab tracking-shipping-tab px-4 py-2 focus:outline-none"
          >
            Track Order
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="trackorder">
          <div>
            <h2 className="g mb-3 tracking-form-heading">Track Order Form</h2>
            <Tabs.Root defaultValue="mobile">
              <Tabs.List
                className="tracking-tabs flex gap-5 border-gray-200 mb-5"
                aria-label="Tracking Types"
              >
                <Tabs.Trigger
                  value="mobile"
                  className="tracking-tab px-4 py-2 rounded-full focus:outline-none"
                >
                  Mobile No.
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="invoice"
                  className="tracking-tab px-4 py-2 rounded-full focus:outline-none"
                >
                  Invoice No.
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="tracking"
                  className="tracking-tab px-4 py-2 rounded-full focus:outline-none"
                >
                  Tracking No
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="mobile" className="tracking-content">
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-400 outline-none"
                />
                <button
                  className="tracking-otp-btn w-full text-white font-semibold text-lg py-3 flex items-center justify-center gap-2"
                  onClick={openModal} // Open modal on button click
                >
                  Track your order <span role="img" aria-label="location"><MdOutlineLocationOn /></span>
                </button>
              </Tabs.Content>

              <Tabs.Content value="invoice" className="tracking-content">
                <input
                  type="text"
                  placeholder="Invoice Number"
                  className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-400 outline-none"
                />
                <button
                  className="tracking-otp-btn w-full text-white font-semibold text-lg py-3 flex items-center justify-center gap-2"
                  onClick={openModal} // Open modal on button click
                >
                  Track your order <span role="img" aria-label="location"><MdOutlineLocationOn /></span>
                </button>
              </Tabs.Content>

              <Tabs.Content value="tracking" className="tracking-content">
                <input
                  type="text"
                  placeholder="Tracking Number"
                  className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-400 outline-none"
                />
                <button
                  className="tracking-otp-btn w-full text-white font-semibold text-lg py-3 flex items-center justify-center gap-2"
                  onClick={openModal} // Open modal on button click
                >
                  Track your order <span role="img" aria-label="location"><MdOutlineLocationOn /></span>
                </button>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Radix UI Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setModalOpen}>
        <Dialog.Content className=" hero-tracking-modal fixed inset-0 flex items-center justify-center bg-opacity-10">
          <div className="modal-box bg-white rounded-lg p-6 shadow-lg max-w-3xl w-full">
            <Dialog.Title className="hero-tracking-modal-heading text-xl font-semibold">Tracking Journey</Dialog.Title>
            <Dialog.Description className=" text-gray-600">
              Stay updated on your shipment progress
            </Dialog.Description>

            <div className="hero-modal-tracking-container mt-6 flex items-center justify-between relative ">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative max-w-3xl w-full">
                {/* Progress line (only for sm and up) */}
                <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>

                {/* Step */}
                <div className="flex sm:flex-col items-center sm:text-center mb-6 sm:mb-0 sm:w-1/5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                    <Package size={22} />
                  </div>
                  <div className="ml-3 sm:ml-0 sm:mt-2">
                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                    <p className="text-xs text-gray-500">15 Sept 2025, 10:30 AM</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:text-center mb-6 sm:mb-0 sm:w-1/5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
                    <Truck size={22} />
                  </div>
                  <div className="ml-3 sm:ml-0 sm:mt-2">
                    <p className="text-sm font-medium text-gray-900">Shipped</p>
                    <p className="text-xs text-gray-500">16 Sept 2025, 08:15 AM</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:text-center mb-6 sm:mb-0 sm:w-1/5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600">
                    <MapPin size={22} />
                  </div>
                  <div className="ml-3 sm:ml-0 sm:mt-2">
                    <p className="text-sm font-medium text-gray-900">In Transit</p>
                    <p className="text-xs text-gray-500">17 Sept 2025, 05:40 PM</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:text-center mb-6 sm:mb-0 sm:w-1/5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400">
                    <Clock size={22} />
                  </div>
                  <div className="ml-3 sm:ml-0 sm:mt-2">
                    <p className="text-sm font-medium text-gray-900">Out for Delivery</p>
                    <p className="text-xs text-gray-500">Pending...</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:text-center sm:w-1/5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400">
                    <CheckCircle2 size={22} />
                  </div>
                  <div className="ml-3 sm:ml-0 sm:mt-2">
                    <p className="text-sm font-medium text-gray-900">Delivered</p>
                    <p className="text-xs text-gray-500">Awaiting update</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-modal-tracking-btn flex justify-end gap-3 mt-4">
              <Dialog.Close asChild>
                <Button className='hero-modal-tracking-btns' color="danger" variant="light">Close</Button>
              </Dialog.Close>

            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

    </div>
  );
}
