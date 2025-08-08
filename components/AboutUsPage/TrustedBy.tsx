"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiAward } from "react-icons/fi";

const trustedLogos = [
  {
    name: "Ministry of Education",
    src: "/logos/talent-hub.jpg",
    alt: "Ministry of Education logo",
  },
  {
    name: "Lead Uni",
    src: "/logos/talent-hub.jpg",
    alt: "Lead University logo",
  },
  {
    name: "DataGrow Inc",
    src: "/logos/talent-hub.jpg",
    alt: "DataGrow Inc logo",
  },
  { name: "TalentHub", src: "/logos/talent-hub.jpg", alt: "TalentHub logo" },
  { name: "EduLink", src: "/logos/talent-hub.jpg", alt: "EduLink logo" },
];

const complianceItems = [
  {
    title: "ISO-Aligned Data Handling",
    icon: <FiAward size={80} />,
    alt: "ISO certification icon",
  },
  {
    title: "Partnered Institutions",
    icon: <FiAward size={80} />,
    alt: "Partnered institutions icon",
  },
  {
    title: "GDPR-Conscious",
    icon: <FiAward size={80} />,
    alt: "GDPR compliance icon",
  },
];

export default function TrustedSection() {
  return (
    <section
      aria-labelledby="trusted-section"
      className="bg-gray-900 py-16 px-4 md:px-16 mx-auto"
    >
      {/* Trusted By */}
      <h2
        id="trusted-section"
        className="text-center text-3xl md:text-5xl gray-text-outline uppercase font-bold text-gray-900 pb-12"
      >
        Trusted By
      </h2>

      {/* Marquee */}
      <div
        className="overflow-hidden"
        role="region"
        aria-label="Trusted partners carousel"
      >
        <motion.div
          className="flex space-x-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          }}
        >
          {[...trustedLogos, ...trustedLogos].map((logo, index) => (
            <div
              key={index}
              className="min-w-[160px] bg-gray-500 rounded-[8px] shadow-sm p-4 text-center"
              tabIndex={0}
              aria-label={`Trusted by ${logo.name}`}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={80}
                height={80}
                className="mx-auto mb-2 object-contain rounded-full"
              />
              <p className="text-sm text-gray-100 font-medium">{logo.name}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Certifications & Compliance */}
      <h3 className="text-center text-2xl font-semibold text-gray-200 mt-16 mb-8">
        Certifications & Compliance
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {complianceItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-500 rounded-[8px] shadow-md px-6 py-16 flex flex-col gap-10 items-center text-center"
            tabIndex={0}
            role="region"
            aria-label={item.title}
          >
            <span className="text-gray-100">{item.icon}</span>
            <p className="text-[1.5rem] font-medium text-gray-100">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
