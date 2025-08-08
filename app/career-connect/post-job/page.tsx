"use client";

import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import Image from "next/image";
import Link from "next/link";
import {
  LucideIcon,
  UserCheck,
  Brain,
  ListCheck,
  Bell,
  Briefcase,
} from "lucide-react";
import HowItWorks from "@/components/HomePage/HowItWorks";

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

type PlatformFeaturesItem = {
  icon: LucideIcon;
  title?: string;
  desc?: string;
};

const platformFeatures: PlatformFeaturesItem[] = [
  {
    icon: UserCheck,
    title: "Talent Pre-screening",
    desc: "Reach graduates who’ve been trained, coached, and CV-reviewed",
  },
  {
    icon: Brain,
    title: "Match by Skills & Tags",
    desc: "Post by job type, tags, location, or program-trained cohorts",
  },
  {
    icon: ListCheck,
    title: "Structured Posting Form",
    desc: "Add required skills, questions, and role goals",
  },
  {
    icon: Bell,
    title: "Automated Talent Alerts",
    desc: "Our system notifies relevant talent pools instantly",
  },
  {
    icon: Briefcase,
    title: "Add to Shortlist Dashboard",
    desc: "Track applicants and match scores from one view",
  },
];

const jobPosting = [
  {
    id: 1,
    title: "Role Info",
    description: [
      "Job Title, Type, Industry",
      "Work Type (Remote, Hybrid, In-person)",
      "Duration (Internship, Contract, Full-Time)",
    ],
    badge: "1",
    side: "left" as const,
  },
  {
    id: 2,
    title: "Required Skills",
    description: [
      "Select from tag library or write-in (e.g., SQL, Public Speaking)",
      " Choose preferred certifications or trainings",
    ],
    badge: "2",
    side: "right" as const,
  },
  {
    id: 3,
    title: "About the Employer",
    description: ["Short company intro or link to your profile"],
    badge: "3",
    side: "left" as const,
  },
  {
    id: 4,
    title: "Assessment Option",
    description: [
      "Choose: No test / Upload test / Request TechEdu custom screening",
    ],
    badge: "4",
    side: "right" as const,
  },
  {
    id: 5,
    title: "Deadline & CTA Buttons",
    description: [
      "Set Application Deadline",
      "Choose Auto-Shortlist or Manual Review",
    ],
    badge: "5",
    side: "left" as const,
  },
];

export default function ForEmployers() {
  return (
    <>
      <header className="relative w-full px-4 pt-20 md:pt-16 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[85vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-20">
          {/* Left: Hero Content */}
          <div className="space-y-4 text-center md:pt-[6rem] xl:text-left xl:pt-12">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[63vw] text-white">
              Post a Role. Reach Job-Ready Graduates Faster.
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pt-4 md:pb-12">
              Whether you're hiring interns, graduate trainees, or junior
              analysts, CareerConnect gives you the tools to post roles with
              precision, visibility, and built-in support. <br />
              It’s not just another job form. It’s your first step to smarter
              graduate hiring.
            </p>
          </div>

          {/* Right Illustration */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[5rem] pb-4">
            {/* Video Container */}
            <div className="relative w-full rounded-xl overflow-hidden h-[16rem] md:h-[24rem]">
              <Image
                src="/icons/undraw_interview_yz52.svg"
                alt=""
                className="w-full h-full"
                height={250}
                width={300}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 md:px-16 bg-gray-100">
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
                  size={70}
                  className="text-black bg-white p-2 rounded-[16px] mb-3"
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
        title="Recruiters Love the Flow"
        steps={jobPosting}
        resultLink={{
          text: "Book a Free Discovery Call",
          href: "/contact#discovery-call",
        }}
        primaryColor="green-600"
        secondaryColor="[#011F72]"
        className="bg-gray-100"
      />

      <StoryCarousel
        stories={HRVoices}
        title="Recruiters Love the Flow"
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
                Don’t Just Post — Match.
              </h2>
              <p className="text-gray-700 text-lg">
                CareerConnect turns job posts into smart hiring signals —
                connecting you to verified talent and optional screening support
                from TechEdu’s recruitment team.
              </p>
            </div>

            <div className="flex flex-col items-end gap-4">
              {[
                {
                  text: "Post Your First Job Now",
                  href: "/dashboard",
                },
                {
                  text: "Talk to Our Recruit Team",
                  href: "/contact#discovery-call",
                },
                {
                  text: "See Talent you could Reach",
                  href: "/career-connect/talents",
                },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="bg-gray-200 hover:bg-gray-300 text-[#011F72] font-semibold focus-visible:outline 
                  focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 rounded-[10px] transition-all 
                  duration-200 ease-in-out hover:tracking-wider text-center w-full md:w-[300px]"
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
