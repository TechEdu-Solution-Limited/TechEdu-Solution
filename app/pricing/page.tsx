"use client";

import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import { useState } from "react";
import {
  Clock,
  CheckCircle,
  GraduationCap,
  Eye,
  Brain,
  Users,
  BarChart3,
  Briefcase,
  BookOpen,
  Target,
  Zap,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { MdEmail } from "react-icons/md";

type TabType =
  | "academic"
  | "career"
  | "corporate"
  | "ai"
  | "talent"
  | "training";

type ServiceCategory = {
  icon: LucideIcon;
  title: string;
  description: string;
  services: Array<{
    name: string;
    tier?: string;
    format: string;
    price: string;
    delivery?: string;
  }>;
};

const serviceCategories: Record<TabType, ServiceCategory> = {
  academic: {
    icon: GraduationCap,
    title: "Academic Services",
    description: "Comprehensive academic support for students and researchers",
    services: [
      {
        name: "PhD Mentoring",
        format: "Per session",
        price: "£80/hr",
        delivery: "Rolling basis, as needed",
      },
      {
        name: "PhD Admission & Scholarship Coaching",
        format: "6 Month Programme",
        price: "£1,000",
        delivery: "Twice monthly, flexible booking",
      },
      {
        name: "General Mentoring & Pastoral Care",
        format: "Per session",
        price: "£60/hr",
        delivery: "Rolling basis, as needed",
      },
      {
        name: "Academic Transition Training",
        format: "3-hour workshop",
        price: "£150",
        delivery: "Flexible delivery option",
      },
      {
        name: "Master's Project Data Analysis",
        format: "Project-based",
        price: "£300",
        delivery: "7-10 business days",
      },
      {
        name: "Thesis Review & Editing",
        format: "Per 10,000 words",
        price: "£100",
        delivery: "7-10 business days",
      },
      {
        name: "Academic Publication Support",
        format: "2 months, 4 sessions",
        price: "£400",
        delivery: "Includes critical review of papers",
      },
    ],
  },
  career: {
    icon: Briefcase,
    title: "Career Development Services",
    description: "Professional career guidance and development support",
    services: [
      {
        name: "CV Revamp",
        tier: "Essential Refresh",
        format: "1:1 document review + revisions + optimized final CV",
        price: "£80",
        delivery: "3-5 business days, includes 1 feedback round",
      },
      {
        name: "Interview Preparation",
        tier: "Targeted Coaching",
        format: "1-hour online session + prep resources + feedback",
        price: "£70/hr",
        delivery: "Booked 3-5 days in advance",
      },
      {
        name: "Career Coaching",
        tier: "Strategic Guidance",
        format: "1:1 goal-setting, career roadmap, job market insight",
        price: "£70/hr",
        delivery: "Rolling basis, tailored to client schedule",
      },
    ],
  },
  corporate: {
    icon: Users,
    title: "Corporate Consultancy & Business Training",
    description: "Professional business analysis and leadership development",
    services: [
      {
        name: "Business Analysis Training",
        tier: "Essentials",
        format: "8 weeks program, 1-day workshop + toolkit",
        price: "£700",
        delivery: "Scheduled 2-4 weeks in advance",
      },
      {
        name: "Professional Consultancy",
        tier: "Hourly Advisory",
        format: "1:1 strategy sessions (online)",
        price: "£100/hr",
        delivery: "Rolling availability, 1-hour increments",
      },
      {
        name: "Leadership & Management",
        tier: "Executive Coaching",
        format: "In-person or online, full-day session with customized plan",
        price: "£500/day",
        delivery: "Includes prep call + post-training handouts",
      },
      {
        name: "Academic Data Analysis",
        tier: "Standard",
        format: "Dataset review, analysis, visualization, and report",
        price: "£300/project",
        delivery: "5-7 business days",
      },
      {
        name: "Corporate Insights",
        tier: "Targeted Insight",
        format: "Data-driven decision support (1-week sprint)",
        price: "£500/project",
        delivery: "1-2 weeks per project",
      },
      {
        name: "Ongoing Analyst Support",
        tier: "On-call Consultation",
        format: "On-call consultation + analysis reports",
        price: "£100/hr",
        delivery: "Ongoing by agreement",
      },
    ],
  },
  ai: {
    icon: Brain,
    title: "AI Consultancy Packages",
    description: "Comprehensive AI governance and ethics consultation",
    services: [
      {
        name: "AI Ethics Consultation",
        tier: "Essentials",
        format: "1-hour live session + summary brief",
        price: "£150/hr",
        delivery: "48-hour advance booking recommended",
      },
      {
        name: "AI Ethics Consultation",
        tier: "Executive Workshop",
        format: "2.5-hour live workshop + toolkit + Q&A",
        price: "£400",
        delivery: "Scheduled 2 weeks in advance",
      },
      {
        name: "AI Governance Framework",
        tier: "Core Advisory",
        format: "3 strategy sessions + framework blueprint",
        price: "£800",
        delivery: "4-6 week engagement",
      },
      {
        name: "AI Governance Framework",
        tier: "Comprehensive",
        format: "Advisory + draft policy + roadmap + final review",
        price: "£1,200",
        delivery: "4-6 week engagement (recommended)",
      },
      {
        name: "Enterprise AI Governance",
        tier: "Advisory Only",
        format: "4 strategy sessions + executive report",
        price: "£2,000",
        delivery: "6-10 weeks based on scope",
      },
      {
        name: "Enterprise AI Governance",
        tier: "Full Suite",
        format: "Includes audits, risk matrix, policies, training resources",
        price: "£3,500-£5,000",
        delivery: "6-10 weeks based on scope",
      },
    ],
  },
  talent: {
    icon: Target,
    title: "Tech Talent Resourcing",
    description: "Specialized recruitment and talent acquisition services",
    services: [
      {
        name: "Tech Talent Sourcing",
        tier: "Standard Search",
        format: "Targeted candidate sourcing + shortlist",
        price: "£500/hire",
        delivery: "2-6 weeks per hire",
      },
      {
        name: "Tech Talent Sourcing",
        tier: "Executive & Specialized Search",
        format: "Full-cycle recruitment, interviews, + strategic fit analysis",
        price: "£1,500/hire",
        delivery: "2-6 weeks per hire",
      },
    ],
  },
  training: {
    icon: BookOpen,
    title: "Technology-Enhanced Learning",
    description: "Interactive workshops and comprehensive training programs",
    services: [
      {
        name: "Workshops & Training",
        tier: "Essentials",
        format: "1.5-hour session + training slides",
        price: "£70",
        delivery: "Scheduled 2-4 weeks in advance",
      },
      {
        name: "Workshops & Training",
        tier: "Comprehensive Learning",
        format:
          "3-hour deep-dive + interactive exercises + post-session support",
        price: "£150",
        delivery: "Scheduled 2-4 weeks in advance",
      },
    ],
  },
};

const WhatUsersSay: Story[] = [
  {
    name: "Dr. Sarah M.",
    country: "UK",
    image: "/assets/student.webp",
    review:
      "The PhD mentoring sessions were invaluable for my research journey. Highly recommend!",
    role: "PhD Student",
  },
  {
    name: "Michael R.",
    country: "UK",
    image: "/assets/employer.webp",
    review:
      "The AI governance framework helped us implement responsible AI practices across our organization.",
    role: "CTO",
  },
];

const addOns = [
  {
    category: "Corporate",
    items: [
      "Post-training mentoring: £100/hr",
      "Implementation coaching: £100/hr",
    ],
  },
  {
    category: "AI Consultancy",
    items: [
      "Rapid delivery option: +20%",
      "Custom policy documentation: +£300",
      "Staff training module design: +£500",
    ],
  },
  {
    category: "Talent Resourcing",
    items: [
      "Retainer option for long-term partnerships (volume discounts available)",
    ],
  },
  {
    category: "Training",
    items: ["Customized Training Modules: £200-£300/session"],
  },
];

export default function Pricing() {
  const [tab, setTab] = useState<TabType>("academic");

  return (
    <>
      <header className="mx-auto px-4 md:px-16 pt-20 pb-16 flex flex-col items-center justify-center text-center bg-[#0D1140] w-full md:h-[70vh]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-200 pb-4 pt-20">
          Comprehensive Professional Services
        </h1>
        <p className="text-base sm:text-lg font-medium text-white sm:text-xl max-w-4xl mx-auto">
          From academic mentoring to AI governance, we offer specialized
          services designed to accelerate your success across education, career,
          and business.
        </p>
      </header>

      {/* SERVICE CATEGORIES */}
      <section className="py-12 sm:py-16 px-4 md:px-8 bg-white">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold uppercase text-outline text-white">
            Choose Your Service Category
          </h2>
          <p className="text-gray-600 pt-4 text-sm sm:text-base">
            Explore our comprehensive range of professional services tailored to
            your needs
          </p>
        </div>

        <div
          className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-10 px-2"
          role="tablist"
        >
          {Object.entries(serviceCategories).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key as TabType)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 ease-in-out text-xs sm:text-sm md:text-base ${
                  tab === key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">
                  {category.title.split(" ")[0]}
                </span>
                <span className="sm:hidden">
                  {category.title.split(" ")[0].slice(0, 3)}
                </span>
              </button>
            );
          })}
        </div>

        {/* SERVICE DETAILS */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#011F72] mb-2">
              {serviceCategories[tab].title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {serviceCategories[tab].description}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {serviceCategories[tab].services.map((service, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between w-full sm:w-80 lg:w-96"
              >
                <div className="space-y-10 mb-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-base sm:text-lg text-gray-800">
                        {service.name}
                      </h4>
                      {service.tier && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full mt-1">
                          {service.tier}
                        </span>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">
                        {service.price}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                    <p>
                      <strong>Format:</strong> {service.format}
                    </p>
                    {service.delivery && (
                      <p>
                        <strong>Delivery:</strong> {service.delivery}
                      </p>
                    )}
                  </div>
                </div>

                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-[10px] transition-colors text-sm sm:text-base">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADD-ON SERVICES */}
      <section className="py-12 sm:py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Optional Add-On Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {addOns.map((category, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm"
              >
                <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-blue-600">
                  {category.category}
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1 flex-shrink-0">
                        •
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoryCarousel
        stories={WhatUsersSay}
        title="What Our Clients Say"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />

      {/* CONTACT SECTION */}
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
                Need help choosing a plan?
              </h2>
              <p className="flex items-center gap-2">
                <MdEmail size={28} className="text-[#011F72] flex-shrink-0" />
                <Link
                  href="mailto:contact@techedusolution.com"
                  className="text-[1rem] text-black font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                >
                  careerconnect@techedusolution.com
                </Link>
              </p>
            </div>

            <div className="flex flex-col items-end gap-4">
              {[
                {
                  text: "Book a Free Discovery Call",
                  href: "/contact#discovery-call",
                },
                { text: "Browse FAQs", href: "/about" },
                { text: "Chat With Us", href: "/contact" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="bg-gray-200 text-[#011F72] hover:bg-gray-300 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 rounded transition-all duration-200 ease-in-out hover:tracking-wider text-center w-full md:w-[300px]"
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
