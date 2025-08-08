"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import ServicesAccordion from "@/components/AcademicServices/ServicesAccordion";
import { FaChartLine } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import HowItWorks from "@/components/HomePage/HowItWorks";
import { LuGraduationCap, LuPackage } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import PricingComparisonTable from "@/components/PricingComparisionTable";
import { FiHeart, FiHome, FiMonitor, FiShoppingBag } from "react-icons/fi";

const stats = [
  { label: "Candidate Interviewed", value: "500+" },
  { label: "Role Successfully Filled", value: "60+" },
  { label: "Partner Institution", value: "40+" },
  { label: "Active Countries", value: "6+" },
];

const careerConnect = [
  {
    id: 1,
    title: "For Employers",
    icon: Briefcase,
    description: "Post Smarter. Hire Faster.",
    details: [
      "A branded employer dashboard",
      "Skill-aligned candidate discovery",
      "CV review and mock interview insights",
      "Requestable assessments (optional)",
      "Real-time shortlist sharing with your team",
    ],
    cta: {
      label: "Create Your Hiring Profile →",
      href: "/get-started",
    },
  },
  {
    id: 2,
    title: "For Graduates & Jobseekers",
    icon: GraduationCap,
    description: "Be More Than a CV. Get Discovered.",
    details: [
      "Create a verified graduate profile",
      "Join curated talent groups by skill or industry",
      "Get notified when you're shortlisted",
      "Access employer feedback and improvement tips",
      "Showcase your project portfolio and soft skills",
    ],
    cta: {
      label: "Join CareerConnect as Talent →",
      href: "/get-started",
    },
  },
];

const trustedLogos = [
  {
    name: "Tech",
    roles: "Data Analysts, Product Interns, Devs",
    icon: <FiMonitor size={40} />,
    alt: "Technology sector icon",
  },
  {
    name: "Health",
    roles: "Clinical Assistants, Patient Liaisons",
    icon: <FiHeart size={40} />,
    alt: "Healthcare sector icon",
  },
  {
    name: "Finance",
    roles: "Risk Analysts, Customer Support",
    icon: <FaChartLine size={40} />,
    alt: "Finance sector icon",
  },
  {
    name: "Public Sector",
    roles: "Corps Members, Admin Officers",
    icon: <FiHome size={40} />,
    alt: "Public sector icon",
  },
  {
    name: "Retail",
    roles: "Sales Associates, Store Leads",
    icon: <FiShoppingBag size={40} />,
    alt: "Retail sector icon",
  },
];

const SuccessStories: Story[] = [
  {
    name: "Ngozi B.",
    country: "UK",
    image: "/assets/ngozi.webp",
    review:
      "I used CareerConnect to hire two data analysts and one graduate intern — all within two weeks.",
    role: "HR Manager, Fintech Startup",
  },
  {
    name: "Tomi A.",
    country: "UK",
    image: "/assets/tomi.webp",
    review:
      "It was the first time I got interview feedback and not just rejection silence.",
    role: "Graduate Trainee (Data)",
  },
  {
    name: "Halima M.",
    country: "UK",
    image: "/assets/halima.webp",
    review:
      "Being on the platform felt like having a coach and a recruiter in the same place.",
    role: "HR Assistant (Healthcare)",
  },
];

const careerConnectJourney = [
  {
    id: 1,
    title: "Graduate Preparation",
    description:
      "Graduates get coached, trained, and verified through our ecosystem",
    badge: "1",
    side: "left" as const,
  },
  {
    id: 2,
    title: "Employer Engagement",
    description:
      "Employers create profiles and post roles, filtering by industry or skill",
    badge: "2",
    side: "right" as const,
  },
  {
    id: 3,
    title: "Smart Matching",
    description:
      "Our smart engine connects them, allowing you to shortlist, assess, and schedule directly",
    badge: "3",
    side: "left" as const,
  },
];

export default function CareerConnect() {
  return (
    <>
      {/* HERO SECTION */}
      <header className="relative w-full px-4 pt-20 md:pt-16 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[80vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-4 text-center md:pt-[6rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[52vw] text-white">
              Where Employers and Job-Ready Talent Connect in Real-Time
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pb-12">
              CareerConnect is TechEdu Solution's dedicated career platform that
              links graduates, entry-level professionals, and skilled interns
              with organizations that value capability, not just credentials.
              It's not just a job board — it's a talent-matching engine, backed
              by coaching, screening, and verified profiles.
            </p>

            <div className="">
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:text-blue-400 text-white text-center px-6 py-4 rounded text-[1rem] font-medium transition "
              >
                Book a Free Discovery Call
              </Link>
            </div>
          </div>

          {/* Right Video */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[5rem] pb-4">
            {/* Video Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[24rem]">
              <Image
                src="/assets/graduate.webp"
                alt=""
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <section
        aria-labelledby="how-it-works"
        className="bg-white text-gray-900"
      >
        {/* STATS */}
        <div className="bg-gray-200 py-10">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-8 px-4 text-center">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center w-36"
              >
                <p className="text-4xl font-extrabold text-gray-700">
                  {stat.value}
                </p>
                <p className="text-[14px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Journey on CareerConnect */}
      <HowItWorks
        title="How CareerConnect Works"
        steps={careerConnectJourney}
        resultLink={{
          text: "Join as a Graduate →",
          href: "/register",
        }}
        primaryColor="green-600"
        secondaryColor="[#011F72]"
        className="bg-gray-100"
      />
      <div className="flex justify-center gap-4 -mt-[2.3rem] mb-12">
        <Link
          href="/employers/register"
          className="bg-[#0D1140] hover:text-blue-400 text-white px-6 py-3 rounded text-[1rem] font-medium transition"
        >
          Create Employer Account →
        </Link>
      </div>

      {/* ACCORDION */}
      <ServicesAccordion
        title="Corporate Consultancy Services"
        services={careerConnect}
        className="bg-gradient-to-b from-gray-50 to-white"
        buttonClassName="bg-white hover:bg-gray-50"
        iconClassName="text-indigo-600"
        panelClassName="bg-gray-50"
      />

      {/* STORIES */}
      <StoryCarousel
        stories={SuccessStories}
        title="HR Voices"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />

      {/* PRICING */}
      <PricingComparisonTable />

      {/* SMART TOOLS */}
      <section
        aria-labelledby="what-we-offer-heading"
        className="bg-white py-20 px-4 md:px-16 mx-auto"
      >
        <h2
          id="smart-tools-to-accelerate-heading"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
        >
          Powered by the TechEdu Ecosystem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:max-w-5xl gap-4 md:gap-8 mx-auto">
          {[
            {
              icon: <IoDocumentTextOutline size={45} />,
              title: "CV Builder",
              desc: "Helps candidates submit professional, polished CVs",
              image: "",
              url: "#",
              action: "Try It →",
            },
            {
              icon: <LuGraduationCap size={45} />,
              title: "Mock Interview Coaching",
              desc: "Prepares graduates before your interview",
              image: "",
              url: "#",
              action: "Explore Now →",
            },
            {
              icon: <LuPackage size={45} />,
              title: "Package Estimator",
              desc: "Helps employers bundle hiring + training + dashboard",
              image: "",
              url: "#",
              action: "Coming Soon",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-blue-50 space-y-3 rounded-[8px] shadow-sm p-6 flex flex-col justify-between focus-within:ring-2 focus-within:ring-[#011F72] hover:shadow-md hover:bg-blue-100"
            >
              <span className="text-blue-500 group-hover:text-[#011F72]">
                {item.icon}
              </span>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
              <Link
                href={item.url}
                className="inline-block self-end bg-blue-500 hover:text-blue-400 text-white text-sm font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                aria-label={item.action}
              >
                {item.action}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* INDUSTRIES WE CONNECT TO */}
      <section
        aria-labelledby="trusted-section"
        className="bg-gray-900 py-20 px-4 md:px-16 mx-auto"
      >
        {/* Trusted By */}
        <h2
          id="trusted-section"
          className="text-center text-3xl md:text-5xl font-bold text-gray-200 mb-8"
        >
          Industries We Connect You To
        </h2>

        {/* Marquee */}
        <div
          className="overflow-hidden"
          role="region"
          aria-label="Industry sectors carousel"
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
            {[...trustedLogos, ...trustedLogos].map((sector, index) => (
              <div
                key={index}
                className="min-w-[200px] bg-gray-800 rounded-[8px] shadow-sm p-6 text-center"
                tabIndex={0}
                aria-label={`${sector.name} sector`}
              >
                <div className="text-blue-400 mb-4 flex justify-center">
                  {sector.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  {sector.name}
                </h3>
                <p className="text-sm text-gray-300 max-w-32 mx-auto">
                  {sector.roles}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        aria-labelledby="not-sure-heading"
        className="grid md:grid-cols-2 gap-6 items-center px-4 py-20 md:px-16 mx-auto bg-white"
      >
        <div>
          <h2
            id="not-sure-heading"
            className="text-3xl md:text-5xl font-extrabold text-[#002647] mb-8"
          >
            <span className="uppercase text-outline text-white">
              Hire With Confidence, Apply With Purpose.
            </span>
          </h2>
          <p className="flex items-center gap-2">
            <MdEmail size={28} className="text-[#011F72] flex-shrink-0" />
            <Link
              href="mailto:contact@techedusolution.com"
              className="text-[1rem] text-black font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
            >
              contact@techedusolution.com
            </Link>
          </p>
        </div>
        <div className="flex justify-start md:justify-end">
          <Link
            href="/contact#discovery-call"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            Book a Delivery Call
          </Link>
        </div>
      </section>
    </>
  );
}
