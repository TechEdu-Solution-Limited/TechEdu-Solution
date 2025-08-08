import HowItWorks from "@/components/HomePage/HowItWorks";
import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import {
  CalendarCheck,
  File,
  LucideIcon,
  MailPlus,
  Scroll,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type CVSample = {
  desc: string;
  img: string;
};

const scholarshipCoachSteps = [
  {
    id: 1,
    title: "Create a Free Account",
    badge: "1",
    side: "left" as const,
  },
  {
    id: 2,
    title:
      "Choose a Profile Type (Student / Graduate / Career Switcher / Professional)",
    badge: "2",
    side: "right" as const,
  },
  {
    id: 3,
    title: "Add Your Experience, Skills, Projects, and Education",
    badge: "3",
    side: "left" as const,
  },
  {
    id: 4,
    title: "Preview Your CV Live",
    badge: "4",
    side: "right" as const,
  },
  {
    id: 5,
    title: "Export or Request a Review from Our Career Team",
    badge: "5",
    side: "left" as const,
  },
];

const features = [
  {
    title: "Smart Section Templates",
    description:
      "Build professional CVs for international roles or local opportunities",
    image: "/assets/certificate-verifiable.webp",
  },
  {
    title: "Region-Aware Formatting",
    description:
      "Choose CV formats for the UK, EU, US, or Commonwealth systems",
    image: "/assets/certificate-recognized.webp",
  },
  {
    title: "Role-Based Prompts",
    description:
      "Get tailored help for sectors like Tech, NGO, Health, Admin & more",
    image: "/assets/certificate-templates.webp",
  },
  {
    title: "Export in Multiple Formats",
    description:
      "PDF, shareable links, or direct employer viewing (via CareerConnect)",
    image: "/assets/certificate-tamperproof.webp",
  },
  {
    title: "Optional Coaching Review",
    description: "Submit your CV draft for expert feedback and improvements",
    image: "/assets/certificate-global.webp",
  },
];

const sanpleCV: CVSample[] = [
  {
    img: "/templates/cv_1.webp",
    desc: "UK Standard CV",
  },
  {
    img: "/templates/cv_2.webp",
    desc: "US Resume Style",
  },
  {
    img: "/templates/cv_3.webp",
    desc: "International NGO CV",
  },
  {
    img: "/templates/cv_4.webp",
    desc: "Academic CV",
  },
];

const GlobalTestimonials: Story[] = [
  {
    name: "Sami R.",
    image: "/assets/ngozi.webp",
    review:
      "I submitted a CV created here and got two callbacks — one in Germany and one in the UAE.",
    role: "Data Graduate",
  },
  {
    name: "Juliana A.",
    image: "/assets/david.webp",
    country: "UK",
    review:
      "The tool feels localised yet international. Great formatting options for UK and EU companies.",
    role: "Career Coach",
  },
];

const plans = [
  {
    title: "Free",
    price: "£0",
    description: ["Full editor access", "Live preview"],
    buttonText: "Try Free →",
    ariaLabel: "Try Free Plan",
  },
  {
    title: "Pro Access",
    price: "£5 one-time",
    description: ["PDF export", "Expert review", "verified badge"],
    buttonText: "Upgrade to Pro Access →",
    ariaLabel: "Upgrade to Pro Access Plan",
  },
];

const page = () => {
  return (
    <>
      <header className="relative w-full px-8 pt-20 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[72vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-4 text-center md:pt-[4rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[57vw] text-white">
              Build a CV That Opens Doors Anywhere
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pb-6">
              Design a polished, professional CV using our intuitive
              drag-and-drop tool — with expert-reviewed sections,
              industry-aligned formatting, and export-ready files trusted by
              recruiters across the globe.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/cv-builder/#"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Start Building My CV
              </Link>
              <Link
                href="/tools/cv-builder/samples"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                View Sample CVs
              </Link>
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Book a CV Review Session
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[6rem] pb-4">
            {/* Image Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[22rem]">
              <Image
                src="/assets/people-graduating-with-diplomas.webp"
                alt="people-graduating-with-diplomas"
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Why Use TechEdu's Scholarship Coach? */}
      <section
        className="
      py-16 px-4 md:px-12 bg-white"
        aria-labelledby="certificates-heading"
      >
        <div className=" max-w-4xl mx-auto">
          <h2
            id="certificates-heading"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
          >
            Why Use TechEdu's Scholarship Coach?
          </h2>

          <div className="space-y-16">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row ${
                    !isEven ? "md:flex-row-reverse" : ""
                  } items-center gap-4 md:gap-12`}
                >
                  {/* Image */}
                  <div className="w-full md:w-1/2 h-48 relative rounded-[15px] overflow-hidden border border-gray-200">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks
        title="How It Works"
        steps={scholarshipCoachSteps}
        primaryColor="green-600"
        secondaryColor="[#011F72]"
        className="bg-gray-100"
      />

      {/* Sample CV Styles */}
      <section className="bg-white">
        <div className="py-16 px-4 md:px-16">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-12">
            Sample CV Styles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {sanpleCV.map((item, index) => {
              return (
                <div
                  key={index}
                  className="rounded-[10px] px-4 py-7 flex flex-col items-center"
                >
                  <Image
                    src={item.img}
                    alt={item.desc}
                    width={200}
                    height={260}
                    className="text-white bg-gray-400 p-2 rounded-[8px] mb-5"
                  />
                  <p className="text-sm text-gray-800 text-center font-semibold">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
          <Link
            href="/training/certifications"
            className="bg-gray-200 hover:bg-gray-300 shadow-md flex justify-center w-fit mx-auto mt-12 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] text-[1rem] transition"
          >
            Learn How Certification Works →
          </Link>
        </div>
      </section>

      {/* Plan & Access */}
      <section
        aria-labelledby="plans-heading"
        className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8"
      >
        <h2
          id="plans-heading"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-12"
        >
          CV Builder Plans
        </h2>

        <div className="mt-10 grid gap-12 sm:grid-cols-2 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="p-2 border-2 border-gray-400 rounded-2xl"
            >
              <div
                className="bg-gray-200 rounded-xl shadow-md border border-gray-300 px-10 py-16 flex flex-col justify-between h-full"
                role="region"
                aria-labelledby={`plan-${index}`}
              >
                <div>
                  <h3
                    id={`plan-${index}`}
                    className="text-[1.5rem] font-bold text-center text-black mb-4"
                  >
                    {plan.title}
                  </h3>

                  <p className="inline-block border border-gray-600 px-4 py-2 rounded-full text-center text-lg font-medium mb-4 w-full">
                    {plan.price}
                  </p>

                  <ul className="text-gray-700 space-y-2 mb-6">
                    {plan.description.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span
                          className="text-green-600 mr-2 text-lg font-bold"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className="bg-blue-500 hover:bg-green-400 font-bold text-white w-full py-3 rounded-full text-center transition-colors"
                  aria-label={plan.ariaLabel}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <StoryCarousel
        stories={GlobalTestimonials}
        title="Global Testimonials"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />

      {/* Want More Support? */}
      <section
        aria-labelledby="explore-more"
        className="py-20 px-4 md:px-16 bg-gray-100"
      >
        <div className=" max-w-6xl mx-auto flex flex-col items-center">
          <h2
            id="explore-more"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white pb-8"
          >
            Want More Support?
          </h2>
          {[
            {
              title: "Have an existing CV you want reviewed?",
              linkTitle: "Upload My CV for Feedback →",
              href: "#",
            },
            {
              title: "Need career coaching alongside your resume?",
              linkTitle: "Book a Strategy Call →",
              href: "/contact#discovery-call",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="pb-4 grid grid-cols-1 md:grid-cols-2 items-center md:gap-8 textt-center md:text-left"
            >
              <p>{item.title}</p>
              <Link
                href={item.href}
                className="flex flex-col items-center bg-gray-200 hover:bg-gray-300 shadow-md text-[#011F72] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 mt-4 rounded-[10px] transition-all duration-200 ease-in-out hover:tracking-wider text-center w-full md:w-[400px]"
                aria-label={item.linkTitle}
              >
                {item.linkTitle}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default page;
