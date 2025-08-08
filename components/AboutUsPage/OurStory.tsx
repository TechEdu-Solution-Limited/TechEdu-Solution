// components/OurStory.tsx

import { BookOpen, Globe, Briefcase, BarChart2, Search } from "lucide-react";
import Image from "next/image";

const features = [
  { icon: <BookOpen size={60} />, label: "Graduate research" },
  { icon: <Globe size={60} />, label: "Global scholarship coaching" },
  { icon: <Briefcase size={60} />, label: "Resume and career toolkits" },
  {
    icon: <BarChart2 size={60} />,
    label: "Data-backed training for companies",
  },
  {
    icon: <Search size={60} />,
    label: "Verified talent pipelines for hiring managers",
  },
];

export default function OurStory() {
  return (
    <>
      <section className="bg-white py-16 px-4 md:px-16 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white">
            How We Got Here – Our Story
          </h2>
          <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            TechEdu Solution Limited began as a one-man effort to guide
            struggling students. Within a year, it became a full-service,
            multi-role platform supporting:
          </p>
        </div>

        <ul
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
          aria-label="Platform Support Services"
        >
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-md shadow-sm bg-gray-100"
              tabIndex={0}
              aria-label={feature.label}
            >
              <span className="bg-gray-300 text-gray-800 px-4 py-3 transition focus-within:ring-2 focus-within:ring-[#011F72]">
                {feature.icon}
              </span>
              <span className="text-md font-medium">{feature.label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-gray-700 text-base sm:text-lg leading-relaxed">
          Today, our clients range from individuals in London to institutions in
          London.
        </p>
      </section>

      <section className="bg-white py-16 px-4 md:px-16 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-blue-500">
            Our Evolution Timeline
          </h2>
          <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            Year Milestone:
          </p>
        </div>

        {/* Desktop Image */}
        <div className="hidden md:block mt-10">
          <Image
            src="/assets/evolution-timeline.webp"
            alt="Evolution timeline yearly"
            height={300}
            width={450}
            className="w-full h-auto"
          />
        </div>

        {/* Mobile Image */}
        <div className="block md:hidden mt-2">
          <Image
            src="/assets/evolution-timeline-mobile.webp"
            alt="Evolution timeline yearly mobile version"
            height={300}
            width={450}
            className="w-full h-auto"
          />
        </div>
      </section>
    </>
  );
}
