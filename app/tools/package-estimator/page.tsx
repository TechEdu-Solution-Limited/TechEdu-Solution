"use client";

import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import Image from "next/image";
import Link from "next/link";
import {
  LucideIcon,
  TabletSmartphone,
  Calculator,
  Lightbulb,
  Percent,
  CalendarClock,
} from "lucide-react";
import HowItWorks from "@/components/HomePage/HowItWorks";

const Testimonials: Story[] = [
  {
    name: "Olu D.",
    image: "/assets/ngozi.webp",
    review:
      "The estimator helped me budget and unlock only what I needed. I liked that I could upgrade later too.",
    role: "Final Year Student",
  },
  {
    name: "Ariella S",
    image: "/assets/david.webp",
    review:
      "As an HR rep, I used it to build a training + CV screening plan for 6 interns.",
    role: "Talent Coordinator",
  },
];

type PlatformFeaturesItem = {
  icon: LucideIcon;
  title?: string;
  desc?: string;
};

const platformFeatures: PlatformFeaturesItem[] = [
  {
    icon: TabletSmartphone,
    title: "Mix & Match Tools",
    desc: "Bundle CV Builder, Scholarship Coach, Coaching Calls & more",
  },
  {
    icon: Calculator,
    title: "Smart Pricing Logic",
    desc: "See real-time total updates based on your selections",
  },
  {
    icon: Lightbulb,
    title: "Auto-Suggested Bundles",
    desc: "System recommends curated options based on your goals",
  },
  {
    icon: Percent,
    title: "Built-in Discounts",
    desc: "Save 10–20% when bundling 2 or more services",
  },
  {
    icon: CalendarClock,
    title: "Add Booktable Follow-Up",
    desc: "Track applicants and match scores from one view",
  },
];

const howItWorks = [
  {
    id: 1,
    title:
      "Select Your Goal Type (e.g., Job-Seeking, Scholarship, Academic Progression)",
    badge: "1",
    side: "left" as const,
  },
  {
    id: 2,
    title: "Choose Desired Tools or Services",
    badge: "2",
    side: "right" as const,
  },
  {
    id: 3,
    title: "Review Instant Estimate & Suggested Bundle",
    description: ["Short company intro or link to your profile"],
    badge: "3",
    side: "left" as const,
  },
  {
    id: 4,
    title: "Proceed to Checkout or Book a Free Review Call",
    badge: "4",
    side: "right" as const,
  },
];

const bundles = [
  {
    title: "Scholarship Launch Kit",
    description: "Scholarship Coach Pro + CV Builder Pro",
    price: "£12",
    savings: "Save £3",
    imgSrc: "/images/bundle1.png",
    imgAlt: "Scholarship Launch Kit preview image",
    layout: "featured", // large left card
  },
  {
    title: "Career Start Pack",
    description: "CV Builder Pro + Coaching Call",
    price: "£10",
    savings: "Save £2",
    imgSrc: "/images/bundle2.png",
    imgAlt: "Career Start Pack preview image",
    layout: "side", // smaller right top
  },
  {
    title: "All-In Impact Bundle",
    description: "All tools + 2 live sessions",
    price: "£20",
    savings: "Save £5",
    imgSrc: "/images/bundle3.png",
    imgAlt: "All-In Impact Bundle preview image",
    layout: "side", // smaller right bottom
  },
];

const page = () => {
  return (
    <>
      <header className="relative w-full px-4 pt-20 md:pt-16 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[72vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-4 text-center md:pt-[6rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[58vw] text-white">
              Build Your Perfect Support Package in Minutes
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pt-6 md:pb-12">
              Use our interactive Package Estimator to select the services,
              tools, and training you need—then get instant pricing, bundle
              savings, and booking options tailored to your goals.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Link
                href="/tools/package-estimator/start"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Start My Package Estimate
              </Link>
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                View Sample Values
              </Link>
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Book a Call to Review My Estimate
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[5rem] pb-4">
            {/* Video Container */}
            <div className="relative w-full rounded-xl overflow-hidden h-[16rem] md:h-[22rem]">
              <Image
                src="/icons/undraw_calculator_21hp.svg"
                alt=""
                className="w-full h-full"
                height={250}
                width={300}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Why Post on CareerConnect? */}
      <section className="py-20 px-4 md:px-16 bg-white">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-12">
          Why Post on CareerConnect?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {platformFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-gray-200 rounded-[10px] shadow-sm px-3 py-7 flex flex-col items-center"
              >
                <Icon
                  size={60}
                  className="text-[#011F72] bg-white p-2 rounded-[16px] mb-3"
                />
                <h3 className="text-[1rem] text-gray-800 text-center mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-800 text-center">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks
        title="How It Works"
        steps={howItWorks}
        primaryColor="green-600"
        secondaryColor="[#011F72]"
        className="bg-gray-100"
      />

      {/* Sample Pre-Built Bundles */}
      <section
        aria-labelledby="bundle-heading"
        className="px-4 py-16 sm:px-6 lg:px-12 bg-gray-900"
      >
        <div className="max-w-5xl mx-auto w-full">
          <h2
            id="bundle-heading"
            className="text-3xl md:text-5xl font-extrabold uppercase gray-text-outline text-gray-900 text-center mb-12"
          >
            Sample Pre-Built Bundles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left featured card (spans 2 rows) */}
            <div className="lg:row-span-2">
              {bundles
                .filter((b) => b.layout === "featured")
                .map((bundle, idx) => (
                  <article
                    key={idx}
                    className="bg-gray-600 rounded-2xl overflow-hidden shadow-sm flex flex-col focus-within:ring-2 focus-within:ring-blue-500"
                    tabIndex={0}
                    aria-label={`${bundle.title}, ${bundle.price}, ${bundle.savings}`}
                  >
                    <div className="relative h-56 sm:h-[15.5rem] w-full bg-gray-300">
                      <Image
                        src={bundle.imgSrc}
                        alt={bundle.imgAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4 px-8 flex flex-col">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {bundle.title}
                      </h3>
                      <p className="text-sm text-gray-200 mb-2">
                        {bundle.description}
                      </p>
                      <div className="inline-block bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-full shadow-sm w-fit">
                        {bundle.price}{" "}
                        <span className="text-gray-500">
                          ({bundle.savings})
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
            </div>

            {/* Right stacked smaller cards */}
            <div className="grid grid-rows-2 gap-3">
              {bundles
                .filter((b) => b.layout === "side")
                .map((bundle, idx) => (
                  <article
                    key={idx}
                    className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row-reverse sm:items-center h-full focus-within:ring-2 focus-within:ring-blue-500"
                    tabIndex={0}
                    aria-label={`${bundle.title}, ${bundle.price}, ${bundle.savings}`}
                  >
                    <div className="relative w-full sm:w-2/5 h-full min-h-[180px] bg-gray-300">
                      <Image
                        src={bundle.imgSrc}
                        alt={bundle.imgAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4 px-8 flex-1 sm:flex sm:flex-col justify-center">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {bundle.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        {bundle.description}
                      </p>
                      <div className="inline-block bg-white text-gray-900 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm w-fit">
                        {bundle.price}{" "}
                        <span className="text-gray-500">
                          ({bundle.savings})
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div>
      </section>

      <StoryCarousel
        stories={Testimonials}
        title="Testimonials"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />

      {/* For Teams and Custom Needs */}
      <section
        aria-labelledby="explore-more"
        className="py-20 px-4 md:px-16 bg-gray-50"
      >
        <div className=" max-w-6xl mx-auto flex flex-col items-center">
          <h2
            id="explore-more"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white pb-8"
          >
            For Teams and Custom Needs
          </h2>
          {[
            {
              text: "Request a Bulk Estimate for Your Team",
              href: "/contact",
            },
            {
              text: "Partner With TechEdu for White-Labeled Packages",
              href: "/contact",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center bg-gray-200 hover:bg-gray-300 text-[#011F72] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 mt-4 rounded-[10px] transition-all duration-200 ease-in-out hover:tracking-wider text-center w-full md:max-w-[500px]"
              aria-label={item.text}
            >
              {item.text}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default page;
