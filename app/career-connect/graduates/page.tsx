"use client";

import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import Image from "next/image";
import Link from "next/link";
import {
  FiAward,
  FiMonitor,
  FiHeart,
  FiDollarSign,
  FiHome,
  FiShoppingBag,
} from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuGraduationCap } from "react-icons/lu";
import { motion } from "framer-motion";
import HowItWorks from "@/components/HomePage/HowItWorks";
import { FaChartLine } from "react-icons/fa";

const GraduatesSay: Story[] = [
  {
    name: "Tomi A.",
    country: "UK",
    image: "/assets/tomi.webp",
    review:
      "It was the first time I felt seen — not just screened out. The feedback loop changed everything.",
    role: "Graduate Trainee, London",
  },
  {
    name: "Blessing K.",
    country: "UK",
    image: "/assets/blessing.webp",
    review:
      "After using the CV Builder and joining a talent pool, I had 3 interviews within 2 weeks.",
    role: "Analyst Intern",
  },
  {
    name: "Dayo F.",
    country: "UK",
    image: "/assets/dayo.webp",
    review:
      "The coaching wasn't just about jobs. It helped me understand my strengths better.",
    role: "Communications Graduate",
  },
];

const features = [
  {
    title: "Verified Graduate Profiles",
    description:
      "Stand out with profile badges for CV review, coaching, and skills",
    image: "/assets/cv-review.webp",
    alt: "Icon representing verified graduate profiles",
  },
  {
    title: "Employer Feedback Access",
    description:
      "Learn from real hiring managers what you did right (or can improve)",
    image: "/assets/search-talent-filter.webp",
    alt: "Icon representing employer feedback",
  },
  {
    title: "Mock Interview Coaching",
    description: "Get prepped before the call — not judged during it",
    image: "/assets/data-driven.webp",
    alt: "Icon representing mock interview coaching",
  },
  {
    title: "Talent Pool Tagging",
    description: "Be grouped with top talent in your field or track",
    image: "/assets/contact-application.webp",
    alt: "Icon representing talent pool tagging",
  },
  {
    title: "Instant Notifications",
    description: "Know when you've been viewed, shortlisted, or contacted",
    image: "/assets/secure-resume.webp",
    alt: "Icon representing instant notifications",
  },
];

const trustedLogos = [
  {
    name: "Tech",
    roles: "Product Interns, Junior Devs, Data Analysts",
    icon: <FiMonitor size={40} />,
    alt: "Technology sector icon",
  },
  {
    name: "Health",
    roles: "Assistant Admins, Front Desk Officers",
    icon: <FiHeart size={40} />,
    alt: "Healthcare sector icon",
  },
  {
    name: "Finance",
    roles: "Customer Support, Risk Trainees",
    icon: <FaChartLine size={40} />,
    alt: "Finance sector icon",
  },
  {
    name: "Public Sector",
    roles: "Corps Members, Intern Assistants",
    icon: <FiHome size={40} />,
    alt: "Public sector icon",
  },
  {
    name: "Retail",
    roles: "Sales & Ops Assistants",
    icon: <FiShoppingBag size={40} />,
    alt: "Retail sector icon",
  },
];

const complianceItems = [
  {
    title: "CV Reviewed",
    icon: <FiAward size={80} />,
    alt: "CV Reviewed icon",
  },
  {
    title: "Interview-Coached",
    icon: <FiAward size={80} />,
    alt: "Interview-Coached icon",
  },
  {
    title: "Skills-Matched",
    icon: <FiAward size={80} />,
    alt: "Skills-Matched icon",
  },
  {
    title: "Shortlist-Preferred",
    icon: <FiAward size={80} />,
    alt: "Shortlist-Preferred",
  },
];

const careerConnectJourney = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Add education, skills, interests, and availability",
    badge: "1",
    side: "left" as const,
  },
  {
    id: 2,
    title: "Polish Your CV",
    description:
      "Use the CV Builder to polish your resume for recruiter visibility",
    badge: "2",
    side: "right" as const,
  },
  {
    id: 3,
    title: "Interview Preparation",
    description: "Schedule mock interviews and receive prep guidance",
    badge: "3",
    side: "left" as const,
  },
  {
    id: 4,
    title: "Join Talent Pools",
    description: "Get added to talent pools recruiters filter by",
    badge: "4",
    side: "right" as const,
  },
  {
    id: 5,
    title: "Stay Connected",
    description: "Receive invites, shortlist alerts, and feedback",
    badge: "5",
    side: "left" as const,
  },
];

export default function ForGraduates() {
  return (
    <>
      <header className="relative w-full px-4 pt-20 md:pt-20 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[80vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-4 text-center md:pt-[6rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[50vw] text-white">
              Get Discovered. Get Hired. Get Ahead.
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pt-6 md:pb-12">
              You're more than a CV. CareerConnect helps graduates like you{" "}
              <span className="font-bold">stand out</span> — with verified
              profiles, coaching-backed visibility, and direct employer
              matching. Whether you're job-hunting or internship-ready,
              CareerConnect puts you in front of the right eyes — faster.
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
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[22rem]">
              <Image
                src="/assets/graduation.webp"
                alt=""
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      {/* What Makes CareerConnect Different */}
      <section
        className="bg-white py-20 px-4 sm:px-6 md:px-16"
        aria-labelledby="employer-benefits"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2
            id="employer-benefits"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
          >
            What Makes CareerConnect Different
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-[10px] p-6 transition border border-gray-100 hover:shadow-lg focus-within:shadow-md"
                role="group"
                tabIndex={0}
                aria-labelledby={`feature-title-${index}`}
              >
                <div className="w-full h-[200px] relative mb-4">
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    fill
                    className="object-cover rounded-[10px] "
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <h3
                  id={`feature-title-${index}`}
                  className="text-lg font-semibold text-gray-800"
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mt-3">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Journey on CareerConnect */}
      <HowItWorks
        title="Your Journey on CareerConnect"
        steps={careerConnectJourney}
        resultLink={{
          text: "Create Your Profile Now",
          href: "/register",
        }}
        primaryColor="green-600"
        secondaryColor="[#011F72]"
        className="bg-gray-100"
      />

      {/* Tools Just for You */}
      <section
        aria-labelledby="what-we-offer-heading"
        className="bg-white py-20 px-4 md:px-16 mx-auto"
      >
        <h2
          id="smart-tools-to-accelerate-heading"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
        >
          Tools Just for You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:max-w-5xl gap-4 md:gap-8 mx-auto">
          {[
            {
              icon: <IoDocumentTextOutline size={45} />,
              title: "CV Builder",
              desc: "Drag-and-drop resume creator with export options",
              image: "",
              url: "/tools/cv-builder",
              action: "Try It →",
            },
            {
              icon: <LuGraduationCap size={45} />,
              title: "Scholarship Coach",
              desc: "For grads still applying for funded programs",
              image: "",
              url: "/tools/scholarship-coach",
              action: "Explore Now →",
            },
            {
              icon: <IoDocumentTextOutline size={45} />,
              title: "Application Tracker (Beta)",
              desc: "Monitor your submitted roles and feedback",
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

      <StoryCarousel
        stories={GraduatesSay}
        title="What other Graduates Say"
        className="bg-gradient-to-b from-gray-50 to-white "
      />

      <section
        aria-labelledby="trusted-section"
        className="bg-gray-900 py-16 px-4 md:px-16 mx-auto"
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

        {/* Certifications & Compliance */}
        <h3 className="text-center text-2xl font-bold text-gray-100 mt-16 mb-4">
          CareerConnect Badge System
        </h3>
        <p className="text-center text-xl font-semibold text-gray-200 mb-12">
          Earn visibility tags like:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {complianceItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-500 rounded-[8px] shadow-md px-6 py-10 flex flex-col gap-10 items-center text-center"
              tabIndex={0}
              role="region"
              aria-label={item.title}
            >
              <span className="text-gray-100">{item.icon}</span>
              <p className="text-[1.2rem] font-medium text-gray-100">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="explore-more"
        className="py-20 px-4 md:px-16 mx-auto bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2
                id="explore-more"
                className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white"
              >
                Launch Your Career the Smart Way
              </h2>
              <p className="text-gray-700 text-lg">
                You deserve more than a rejection email.
                <br />
                Let's help you build a career path that's visible, guided, and
                actionable.
              </p>
            </div>

            <div className="flex flex-col items-end gap-4">
              {[
                {
                  text: "Create Your CareerConnect Profile",
                  href: "/register",
                },
                { text: "Try the CV Builder", href: "/create-resume" },
                {
                  text: "Book a Discovery Call",
                  href: "/contact#discovery-call",
                },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="bg-gray-200 hover:bg-gray-300 text-[#011F72] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 rounded transition-all duration-200 ease-in-out hover:tracking-wider text-center w-full md:w-[320px]"
                  aria-label={item.text}
                >
                  {item.text} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
