
import { PiDiamondFill } from "react-icons/pi";
import "./CommonStyles.css";

const contacts = [
  { title: "Riyadh (HO)", phones: ["054 430 8508", "053 833 0980"] },
  { title: "Warehouse Riyadh", phones: ["054 314 5105", "054 761 9393"] },
  { title: "Grand Hyper", phones: ["054 735 9696", "054 610 9055"] },
  { title: "Rowdha", phones: ["055 272 2992", "054 928 8722"] },

  { title: "Jeddah-1", phones: ["056 998 7907", "057 152 2920"] },
  { title: "Jeddah-2", phones: ["054 087 3039", "057 467 9180"] },

  { title: "Dammam", phones: ["053 640 5030", "054 482 1449"] },
  { title: "Al Hasa", phones: ["050 062 9263", "054 340 6835"] },

  { title: "Hafar Al Batin", phones: ["055 317 5473", "056 409 3600"] },

  { title: "Buraida-1", phones: ["055 022 4780", "057 703 9591"] },
  { title: "Buraida-2", phones: ["055 409 3712", "054 459 8711"] },

  { title: "Onaizah", phones: ["055 970 2203", "054 750 2203"] },

  { title: "Al Ghat", phones: ["054 586 2301", "050 990 8735"] },

  { title: "Hail", phones: ["050 343 3723", "056 877 8615"] },

  { title: "Al Jouf", phones: ["054 359 1837", "055 811 9967"] },

  { title: "Tabuk", phones: ["053 886 6793", "056 928 2543"] },

  { title: "India", phones: ["+91 9847 803 696"] }
];


export default function ContactGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {contacts.map((contact, idx) => (
        <div
          key={idx}
          className="border border-dashed border-gray-300 rounded-xl p-4 contact-grid-box"
        >
          <div className="flex items-center gap-2 mb-2">
            <PiDiamondFill className="text-[#262262]" />
            <h3 className="font-bold text-gray-900 contact-grid-heading">{contact.title}</h3>
          </div>
          <div className="text-sm text-gray-700 space-y-1 contact-grid-number">
            {contact.phones.map((phone, i) => (
              <p key={i}>
                <a
                key={i}
                href={`tel:${phone.replace(/\s+/g, "")}`}
                >
                  {phone}
                </a>
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
