
import { PiDiamondFill } from "react-icons/pi";
import "./CommonStyles.css";

const contacts = [
  { title: "Riyadh (HO)", phones: ["054 430 8508", "054 314 5105"] },
  { title: "Riyadh", phones: ["053 833 8039", "053 833 0980"] },
  { title: "Buraida", phones: ["055 022 4780", "057 703 9591"] },
  { title: "Al Hasa", phones: ["050 062 9263", "054 340 6835"] },
  { title: "Hail", phones: ["050 343 3723", "056 877 8615"] },
  { title: "Al Jouf", phones: ["054 430 8508", "054 314 5105"] },
  { title: "Riyadh", phones: ["054 359 1837", "055 811 9967"] },
  { title: "Tabuk", phones: ["053 886 6793", "056 928 2543"] },
  { title: "Onaizah", phones: ["055 970 2203", "054 750 2203"] },
  { title: "Dammam", phones: ["053 886 6793", "056 928 2543"] },
  { title: "Al Ghat", phones: ["054 586 2301", "050 990 6735"] },
  { title: "Dubai", phones: ["050 873 5100", "050 873 5200"] },
  { title: "India", phones: ["+91 9847 446 117", "+91 7902 446 117"] },
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
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="hover:underline"
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
