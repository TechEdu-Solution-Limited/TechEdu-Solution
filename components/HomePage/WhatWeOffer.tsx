import {
  GraduationCap,
  Briefcase,
  Building2,
  Users,
  BadgeCheck,
  // ArrowRight,
} from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";
import { PiDotsThreeOutline } from "react-icons/pi";
import Link from "next/link";

const services = [
  {
    title: "Academic Services",
    description: "Mentoring, editing, scholarship coaching",
    cta: "Explore Academic",
    url: "/academic-services",
    icon: (
      <GraduationCap
        size={80}
        className="text-[#00B2FF] group-hover:text-[#2257BF]"
      />
    ),
  },
  {
    title: "Career Development",
    description: "Resume tools, interview prep, coaching",
    cta: "Explore Career",
    url: "/career-development",
    icon: (
      <Briefcase
        size={80}
        className="text-[#00B2FF] group-hover:text-[#2257BF]"
      />
    ),
  },
  {
    title: "Training & Certification",
    description: "Zoom-based programs with real certificates",
    cta: "Browse Training",
    url: "/training",
    icon: (
      <BadgeCheck
        size={80}
        className="text-[#00B2FF] group-hover:text-[#2257BF]"
      />
    ),
  },
  {
    title: "Corporate Consultancy",
    description: "Data training, team transformation",
    cta: "View Consultancy",
    url: "corporate-consultancy",
    icon: (
      <Building2
        size={80}
        className="text-[#00B2FF] group-hover:text-[#2257BF]"
      />
    ),
  },
  {
    title: "CareerConnect",
    description: "Match employers & graduates",
    cta: "Launch CareerConnect",
    url: "/career-connect",
    icon: (
      <Users size={80} className="text-[#00B2FF] group-hover:text-[#2257BF]" />
    ),
  },
  {
    title: "More to Come",
    description: "Stay tuned for upcoming features",
    cta: "Explore More",
    url: "",
    icon: (
      <PiDotsThreeOutline
        size={80}
        className="text-[#00B2FF] group-hover:text-[#2257BF]"
      />
    ),
  },
];

export default function WhatWeOfferSection() {
  return (
    <section
      className="bg-primary py-20 px-8 lg:px-16"
      aria-labelledby="what-we-offer"
    >
      <h2
        id="what-we-offer"
        className="text-3xl md:text-5xl font-extrabold mb-10"
      >
        <span className="uppercase gray-text-outline text-primary">
          What We Offer
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <div
            key={i}
            className="group bg-[#2257BF] hover:bg-blue-500 p-6 transition-colors duration-300 flex items-center gap-4"
          >
            <div className="shrink-0 text-[#04A8F8] group-hover:text-[#00B2FF]">
              {service.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-gray-200">
                {service.title}
              </h3>
              <p className="text-sm text-[#00B2FF] group-hover:text-[#003294] mb-3">
                {service.description}
              </p>
              <Link
                href={service.url}
                className="text-sm group-hover:tracking-widest flex items-center gap-3 font-medium transition-all duration-300 group-hover:text-black text-[#00B2FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300"
                aria-label={service.cta}
              >
                {service.cta} <FaArrowRightLong size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
