// components/TrackingForm.jsx
import * as Tabs from '@radix-ui/react-tabs';
import "./TrackfromStyles.css"
import { MdOutlineLocationOn } from "react-icons/md";
import Image from 'next/image';
import { BsPinMap } from "react-icons/bs";

export default function TrackingForm() {
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
          <Tabs.Trigger
            value="shiporder"
            className="tracking-tab tracking-shipping-tab px-4 py-2 focus:outline-none"
          >
            Ship Order
          </Tabs.Trigger>
        </Tabs.List>


        <Tabs.Content value="trackorder">

          <div>
            <h2 className="g mb-3 tracking-form-heading">Track Order Form</h2>
            <Tabs.Root defaultValue="mobile">
              <Tabs.List
                className="tracking-tabs  flex gap-5 border-gray-200 mb-5"
                aria-label="Tracking Types"
              >
                <Tabs.Trigger
                  value="mobile"
                  className="tracking-tab px-4 py-2  rounded-full focus:outline-none"
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
                  className="tracking-tab px-4 py-2  rounded-full focus:outline-none"
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
                <button className="tracking-otp-btn w-full  text-white font-semibold text-lg  py-3 flex items-center justify-center gap-2">
                  Get OTP <span role="img" aria-label="location"><MdOutlineLocationOn /></span>
                </button>
              </Tabs.Content>
              <Tabs.Content value="invoice" className="tracking-content">

                <input
                  type="text"
                  placeholder="Invoice Number"
                  className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-400 outline-none"
                />
                <button className="tracking-otp-btn w-full text-white text-lg py-3 flex items-center justify-center gap-2">
                  Get OTP <span role="img" aria-label="location"><MdOutlineLocationOn /></span>
                </button>
              </Tabs.Content>
              <Tabs.Content value="tracking" className="tracking-content">

                <input
                  type="text"
                  placeholder="Tracking Number"
                  className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-400 outline-none"
                />
                <button className="tracking-otp-btn w-full  text-white font-semibold text-lg py-3 flex items-center justify-center gap-2">
                  Get OTP <span role="img" aria-label="location"><MdOutlineLocationOn /></span>
                </button>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </Tabs.Content>

        <Tabs.Content value="shiporder">

          <div>
            <h2 className="tracking-form-heading mb-3">Ship Order Form</h2>

            <Tabs.Root defaultValue="domestic">
              {/* Tabs Navigation */}
              <Tabs.List
                className="ship-order-tabs flex gap-2 bg-gray-100 rounded-full p-1 mb-5"
                aria-label="Shipping Types"
              >
                <Tabs.Trigger
                  value="domestic"
                  className="ship-order-tab flex-1 px-6 py-2 text-sm font-medium border-radius data-[state=active]:bg-white data-[state=active]:text-black text-gray-500 transition-colors"
                >
                  Domestic
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="international"
                  className="ship-order-tab flex-1 px-6 py-2 text-sm font-medium rounded-full data-[state=active]:bg-white  data-[state=active]:text-black text-gray-500 transition-colors"
                >
                  International
                </Tabs.Trigger>
              </Tabs.List>

              {/* Domestic Form */}
              <Tabs.Content value="domestic" className="space-y-4">
                <div className="flex items-center gap-3">
                  <span role="img" aria-label="location"><BsPinMap/></span>
                  <input
                    type="text"
                    placeholder="Enter pickup pin code"
                    className="flex-1 bg-gray-100 rounded-xl px-5 py-3 text-gray-600 outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span role="img" aria-label="location"><BsPinMap/></span>
                  <input
                    type="text"
                    placeholder="Enter delivery pin code"
                    className="flex-1 bg-gray-100 rounded-xl px-5 py-3 text-gray-600 outline-none"
                  />
                </div>
                <button className="ship-order-btn w-full  py-3 rounded-xl">
                  Get OTP & Ship Now
                </button>
                <p className="text-center text-red-500 text-sm">
                  Sign up to ship as a business here
                </p>
              </Tabs.Content>

              {/* International Form */}
              <Tabs.Content value="international" className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image src="/Icons/uae-flag.png" width={25} height={25} alt='UAE'/>
                  <input
                    type="text"
                    placeholder="Enter pickup pin code"
                    className="flex-1 bg-gray-100 rounded-xl px-5 py-3 text-gray-600 outline-none"
                  />
                </div>
                <div className="flex items-center gap-5">
                  <BsPinMap/>
                  <input
                    type="text"
                    placeholder="Select delivery country"
                    className="flex-1 bg-gray-100 rounded-xl px-5 py-3 text-gray-600 outline-none"
                  />
                </div>
                <button className="ship-order-btn w-full py-3 rounded-xl">
                  Get OTP & Ship Now
                </button>
                <p className="text-center text-red-500 text-sm">
                  Sign up to ship as a business here
                </p>
              </Tabs.Content>
            </Tabs.Root>


          </div>
        </Tabs.Content>
      </Tabs.Root>


    </div>
  );
}
