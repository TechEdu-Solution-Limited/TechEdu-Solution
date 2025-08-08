import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    image: "/assets/resume.avif",
    alt: "Illustration of CV Builder",
    title: "CV Builder",
    url: "/tools/cv-builder",
    description: "Craft a job-winning CV using expert-backed templates",
  },
  {
    image: "/assets/coaching.webp",
    alt: "Illustration of Scholarship Coach",
    title: "Scholarship Coach",
    url: "/scholarship-coach",
    description: "Refine your story, proposal, and strategy to secure funding",
  },
  {
    image: "/assets/pricing.jpg",
    alt: "Illustration of Package Estimator",
    title: "Package Estimator",
    url: "/tools/package-estimator",
    description: "Mix & match services and see real-time pricing options",
  },
];

export default function SmartTools() {
  return (
    <section
      aria-labelledby="what-we-offer-heading"
      className="py-20 px-4 md:px-16 text-gray-900"
    >
      <h2 className="text-3xl md:text-5xl font-extrabold text-[#002647] mb-8">
        <span className="uppercase text-outline text-white">
          SMART TOOLS TO GET AHEAD
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition duration-300 flex flex-col justify-between focus-within:ring-2 focus-within:ring-[#011F72]"
          >
            <div className="p-4 rounded-[10px]">
              <div className="relative w-full h-[300px] mb-4 rounded-[14px] overflow-hidden">
                <Image
                  src={tool.image}
                  alt={tool.alt}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
              {/* <div className="px-4 py-3 border-t border-gray-200"> */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {tool.title}
              </h3>
              {/* </div> */}
              <button
                type="submit"
                aria-label={`Learn more about ${tool.title}`}
                className="text-[#011F72] hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#011F72] rounded flex items-center justify-between w-full"
              >
                <p className="text-sm text-gray-700 w-[16rem] text-left">
                  {tool.description}
                </p>
                <Link href={tool.url} className="flex items-center gap-2">
                  <p className="font-bold">Try it</p>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
