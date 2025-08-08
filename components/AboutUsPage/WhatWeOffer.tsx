// components/WhatWeOffer.tsx
import { LuRocket, LuPackage, LuScrollText } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import Image from "next/image";

const tools = [
  {
    image: "/assets/resume.avif",
    alt: "Illustration of CV Builder",
    title: "CV Builder",
    description: "Craft a job-winning CV using expert-backed templates",
  },
  {
    image: "/assets/coaching.webp",
    alt: "Illustration of Scholarship Coach",
    title: "Scholarship Coach",
    description: "Refine your story, proposal, and strategy to secure funding",
  },
  {
    image: "/assets/pricing.jpg",
    alt: "Illustration of Package Estimator",
    title: "Package Estimator",
    description: "Mix & match services and see real-time pricing options",
  },
];

export default function WhatWeOffer() {
  return (
    <section
      aria-labelledby="what-we-offer-heading"
      className="bg-gray-100 py-16 px-4 md:px-16 mx-auto"
    >
      <h2
        id="what-we-offer-heading"
        className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center"
      >
        What We Offer
      </h2>

      {/* Core Services */}
      <div className="my-12">
        <h3 className="text-xl font-semibold text-[#011F72] text-center mb-8">
          Core Services
        </h3>

        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6">
          {/* Illustration Placeholder or Static Image */}
          <div
            aria-hidden="true"
            className="w-full md:w-[400px] aspect-video bg-blue-100 rounded-[8px] flex items-center justify-center"
          >
            <Image
              src="/assets/virtual-training-.webp"
              alt="Illustration showing core services"
              height={200}
              width={400}
              className="object-contain rounded-[8px]"
            />
          </div>

          {/* Service List */}
          <ul className="list-none space-y-4 text-gray-900 text-base max-w-md">
            {[
              "Academic Mentorship",
              "Career Coaching & Interview Prep",
              "Leadership and management consultancy",
              "Applied AI & Emerging Tech Masterclass",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center">
                <span
                  aria-hidden="true"
                  className="text-gray-600 mr-2 mt-[2px]"
                >
                  <IoIosCheckmarkCircleOutline size={30} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Micro-Products */}
      {/* <div>
        <h3 className="text-xl font-semibold text-[#011F72] text-center mb-8">
          Micro-Products
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
          {[
            {
              icon: <IoDocumentTextOutline size={45} />,
              title: "CV Builder",
              desc: "Drag-and-drop resume creator with export options",
              image: "",
              url: "#",
              action: "Try It →",
            },
            {
              icon: <LuScrollText size={45} />,
              title: "Scholarship Coach",
              desc: "Application strategy & real-world templates",
              image: "",
              url: "#",
              action: "Get Help →",
            },
            {
              icon: <LuPackage size={45} />,
              title: "Package Estimator",
              desc: "Bundle services with live pricing",
              image: "",
              url: "#",
              action: "Try Now →",
            },
            {
              icon: <LuRocket size={45} />,
              title: "CareerConnect",
              desc: "Match-ready job board for graduates and companies",
              image: "",
              url: "#",
              action: "Visit →",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-white space-y-3 rounded-[8px] shadow-sm p-6 flex flex-col justify-between focus-within:ring-2 focus-within:ring-[#011F72] hover:shadow-md hover:bg-blue-100"
            >
              <span className="text-blue-500 group-hover:text-[#011F72]">{item.icon}</span>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
                <button
                  type="button"
                  className="inline-block self-end bg-blue-500 hover:text-blue-400 text-white text-sm font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                  aria-label={item.action}
                >
                  {item.action}
                </button>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
}
