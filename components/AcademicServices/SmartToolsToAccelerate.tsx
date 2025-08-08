// components/WhatWeOffer.tsx
import { LuRocket, LuPackage, LuScrollText } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

export default function SmartTools() {
  return (
    <section
      aria-labelledby="what-we-offer-heading"
      className="bg-gray-100 py-16 px-4 md:px-16 mx-auto"
    >
      <h2
        id="smart-tools-to-accelerate-heading"
        className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
      >
        Smart Tools to Accelerate Your Journey
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
        {[
          {
            icon: <IoDocumentTextOutline size={60} />,
            title: "CV Builder",
            desc: "Drag-and-drop resume creator with export options",
            image: "",
            url: "#",
            action: "Try It →",
          },
          {
            icon: <LuScrollText size={60} />,
            title: "Scholarship Coach",
            desc: "Application strategy & real-world templates",
            image: "",
            url: "/tools/scholarship-coach",
            action: "Get Help →",
          },
          {
            icon: <LuPackage size={60} />,
            title: "Package Estimator",
            desc: "Bundle services with live pricing",
            image: "",
            url: "/tools/package-estimator/start#estimator-wizard-steps",
            action: "Try Now →",
          },
          {
            icon: <LuRocket size={60} />,
            title: "CareerConnect",
            desc: "Match-ready job board for graduates and companies",
            image: "",
            url: "/career-connect",
            action: "Visit →",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="group bg-white space-y-3 rounded-[8px] shadow-sm p-6 flex flex-col justify-between focus-within:ring-2 focus-within:ring-[#011F72] hover:shadow-md hover:bg-blue-50"
          >
            <span className="text-[#011F72] group-hover:text-blue-500">
              {item.icon}
            </span>
            <div>
              <h4 className="text-[1.4rem] font-semibold text-gray-900 group-hover:text-blue-700 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </div>
            <Link
              href={item.url}
              type="button"
              className="inline-block self-end bg-[#0D1140] group-hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              aria-label={item.action}
            >
              {item.action}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
