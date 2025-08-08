"use client";

import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Timer,
  Target,
  ClipboardList,
  Search,
  FileText,
  FolderPlus,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuPackage, LuRocket } from "react-icons/lu";

const HRVoices: Story[] = [
  {
    name: "Ngozi B.",
    country: "UK",
    image: "/assets/ngozi.webp",
    review:
      "Our HR team saved over 20 hours filtering candidates using CareerConnect's shortlist tools.",
    role: "HR Manager, Fintech Sector",
  },
  {
    name: "David A.",
    country: "UK",
    image: "/assets/david.webp",
    review:
      "What we liked most was the coaching report attached to some applicants' profiles. It gave us more than just a CV.",
    role: "Talent Lead, EduTech Startup",
  },
];

const features = [
  {
    title: "Vetted Talent",
    description:
      "Candidates are screened, CV-polished, and optionally coach-reviewed",
    image: "/assets/cv-review.webp", // ✅ Replace with your image
    alt: "Icon representing vetted talent",
  },
  {
    title: "Advanced Filtering",
    description:
      "Filter by skillset, education, readiness tags, or project history",
    image: "/assets/search-talent-filter.webp",
    alt: "Icon representing advanced filtering",
  },
  {
    title: "Insight-Driven Hiring",
    description: "Access CV feedback reports and mock interview performance",
    image: "/assets/data-driven.webp",
    alt: "Icon representing insight-driven hiring",
  },
  {
    title: "Direct Shortlisting & Contact",
    description: "Add to shortlist, message, or export directly",
    image: "/assets/contact-application.webp",
    alt: "Icon representing shortlisting and contact",
  },
  {
    title: "Internal Sharing",
    description:
      "Share shortlisted profiles with your team or clients securely",
    image: "/assets/secure-resume.webp",
    alt: "Icon representing internal sharing",
  },
];

const stats = [
  { icon: Users, text: "60+ roles filled across 5 sectors" },
  { icon: Timer, text: "2x faster time-to-hire" },
  { icon: Target, text: "3:1 average shortlist-to-interview ratio" },
  { icon: ClipboardList, text: "3:1 average shortlist-to-interview ratio" },
];

const platformFeatures = [
  {
    icon: Search,
    title: "Targeted Talent Discovery",
    desc: "Search by field, training program, or verified status",
  },
  {
    icon: FileText,
    title: "CV & Profile Review",
    desc: "See recruiter notes, coaching feedback, and strength tags",
  },
  {
    icon: FolderPlus,
    title: "Shared Shortlists",
    desc: "Add candidates to role-specific folders and share with team",
  },
  {
    icon: MessageSquare,
    title: "Request Interview Feedback",
    desc: "Ask our team to run mock interviews before final shortlist",
  },
  {
    icon: LayoutDashboard,
    title: "Insight Dashboard (Beta)",
    desc: "Monitor open roles, shortlist rates, and candidate stats",
  },
];

const colors = ["#074a71", "#f6b703", "#04959f", "#049774"];

export default function ForEmployers() {
  return (
    <>
      <header className="relative w-full px-4 pt-20 md:pt-16 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[80vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-4 text-center md:pt-[6rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[63vw] text-white">
              Smarter Hiring Starts Here
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pt-6 md:pb-12">
              Whether you're recruiting interns, entry-level analysts, or
              graduate associates,{" "}
              <span className="font-bold">
                CareerConnect by TechEdu Solution Ltd
              </span>{" "}
              gives you a faster, smarter way to identify job-ready talent —
              with coaching insights, verified profiles, and curated shortlists
              built in. It's more than job posting. It's{" "}
              <span className="font-bold">guided graduate hiring</span> designed
              to reduce friction and increase fit.
            </p>

            <div className="xl:pt-6">
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-green-400 text-white text-center px-6 py-4 rounded text-[1rem] font-medium transition "
              >
                Book a Free Discovery Call
              </Link>
            </div>
          </div>

          {/* Right Video */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[6rem] pb-4">
            {/* Video Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[22rem]">
              <Image
                src="/assets/employer.webp"
                alt=""
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      <section
        className="bg-white py-12 px-4 sm:px-6 md:px-16"
        aria-labelledby="employer-benefits"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2
            id="employer-benefits"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
          >
            Why Employers Choose CareerConnect
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-[10px] p-6 shadow-sm transition hover:shadow-md focus-within:shadow-md"
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

      {/* Success Snapshot */}
      <section className="bg-gray-100 py-20 px-4 md:px-16">
        <h2
          id="success-snapshot"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
        >
          Success Snapshot
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {stats.map(({ icon: Icon, text }, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center w-48"
              role="group"
              aria-label={text}
            >
              <Icon
                className="w-14 h-14 bg-gray-200 p-2 rounded-[10px] text-gray-700 mb-3"
                aria-hidden="true"
                style={{ color: colors[index] }}
              />
              <p className="text-[1rem] text-gray-800">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="success-snapshot"
        className="bg-white text-gray-900 py-20 px-4 md:px-16"
      >
        <div className="" aria-labelledby="platform-features">
          <h2
            id="platform-features"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
          >
            Platform Features at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-14 max-w-6xl mx-auto">
            {platformFeatures.map(({ icon: Icon, title, desc }, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-[12px] p-8 shadow-sm focus-within:ring-2 focus-within:ring-black"
                tabIndex={0}
                role="region"
                aria-labelledby={`feature-title-${index}`}
                aria-describedby={`feature-desc-${index}`}
              >
                <Icon
                  className="w-14 h-14 bg-gray-200 p-2 rounded-[10px] text-gray-700 mb-5"
                  aria-hidden="true"
                />
                <h3
                  id={`feature-title-${index}`}
                  className="text-lg font-semibold text-gray-900 mb-2"
                >
                  {title}
                </h3>
                <p
                  id={`feature-desc-${index}`}
                  className="text-sm text-gray-700"
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:max-w-5xl gap-4 md:gap-8 mx-auto">
          {[
            {
              icon: <IoDocumentTextOutline size={60} />,
              title: "CV Builder",
              desc: "Drag-and-drop resume creator with export options",
              image: "",
              url: "/tools/cv-builder",
              action: "Try It →",
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
              url: "/career-connect/talents",
              action: "Visit →",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-white space-y-3 rounded-[8px] shadow-sm p-6 flex flex-col justify-between focus-within:ring-2 focus-within:ring-[#011F72] hover:shadow-md hover:bg-blue-100"
            >
              <span className="text-[#011F72] group-hover:text-blue-500">
                {item.icon}
              </span>
              <div>
                <h4 className="text-[1.4rem] group-hover:text-blue-500 font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
              <Link
                href={item.url}
                className="inline-block self-end bg-blue-500 group-hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                aria-label={item.action}
              >
                {item.action}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <StoryCarousel
        stories={HRVoices}
        title="HR Voices"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />

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
                Ready to Hire Smarter?
              </h2>
              <p className="text-gray-700 text-lg">
                Customizable consulting bundles for institutions, startups, and
                HR teams.
              </p>
            </div>

            <div className="flex flex-col items-end gap-4">
              {[
                { text: "Create Employer Account", href: "/get-started" },
                {
                  text: "Book a Recruiter Discovery Call",
                  href: "/contact#discovery-call",
                },
                {
                  text: "Browse Verified Talent",
                  href: "/career-connect/talents",
                },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="bg-gray-200 hover:bg-gray-300 text-[#011F72] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 rounded transition-all duration-200 ease-in-out hover:tracking-wider text-center w-full md:w-[350px]"
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
