"use client";

import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import Image from "next/image";
import Link from "next/link";
import { FiAward } from "react-icons/fi";
import { FaAward, FaMedal, FaTrophy } from "react-icons/fa6";
import {
  BarChartIcon,
  BriefcaseIcon,
  CalendarClockIcon,
  GraduationCap,
  Laptop,
  Lightbulb,
  MapPinIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";
import { HiOutlineBriefcase } from "react-icons/hi";

interface PageLink {
  text: string;
  urlpath: string;
}

type CVSample = {
  desc: string;
  img: string;
};

const TalentFeedback: Story[] = [
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

const complianceItems = [
  {
    title: "CV Reviewed",
    icon: <FiAward size={80} />,
    alt: "CV Reviewed icon",
  },
  {
    title: "Interview-Coached",
    icon: <FaMedal size={80} />,
    alt: "Interview-Coached icon",
  },
  {
    title: "Skills-Matched",
    icon: <FaTrophy size={80} />,
    alt: "Skills-Matched icon",
  },
  {
    title: "Shortlist-Preferred",
    icon: <FaAward size={80} />,
    alt: "Shortlist-Preferred",
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
];

export default function Talents() {
  return (
    <>
      <section className="min-h-screen pt-[15vh] pb-16 px-4 md:px-16">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Upload Section */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl text-center font-semibold mb-4">
              Candidate Snapshot
            </h2>
            <label
              htmlFor="profilePhoto"
              className="relative w-[250px] h-[250px] rounded-full overflow-hidden border-2 border-gray-300 shadow-md cursor-pointer group"
            >
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // handle image upload logic
                    console.log("Uploaded image:", file);
                  }
                }}
              />
              <Image
                width={400}
                height={400}
                src="/assets/placeholder-avatar.jpg" // Replace with dynamic source if needed
                alt="Profile"
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 group-hover:opacity-100 transition">
                Click to Upload
              </div>
            </label>
          </div>

          <table className="w-full text-left text-sm md:text-md border-separate border-spacing-y-4 bg-white lg:pt-16 pb-6 rounded-bl-[20px] rounded-br-[20px]">
            <tbody>
              <tr className="px-6">
                <td className="font-medium flex gap-1 border-b-4 border-gray-200 pb-2 px-4">
                  <UserIcon className="w-5 h-5 text-[#011F72]" />
                  Full Name:
                </td>
                <td className="border-b-4 border-gray-200 pb-2">
                  Tomi Adekunle
                </td>
              </tr>
              <tr
              // className="flex flex-row justify-between w-full sm:"
              >
                <td className="font-medium flex gap-1 border-b-4 border-gray-200 pb-2 pl-4">
                  <BriefcaseIcon className="w-5 h-5 text-[#011F72]" />
                  Desired Role:
                </td>
                <td className="border-b-4 border-gray-200 pb-2">
                  Data Analyst / Research Assistant
                </td>
              </tr>
              <tr>
                <td className="font-medium flex gap-1 border-b-4 border-gray-200 pb-2 pl-4">
                  <MapPinIcon className="w-5 h-5 text-[#011F72]" />
                  Location:
                </td>
                <td className="border-b-4 border-gray-200 pb-2">
                  London, UK (Remote-Ready)
                </td>
              </tr>
              <tr>
                <td className="font-medium flex gap-1 border-b-4 border-gray-200 pb-2 pl-4">
                  <BarChartIcon className="w-5 h-5 text-[#011F72]" />
                  CV Insight Score:
                </td>
                <td className="border-b-4 border-gray-200 pb-2">84%</td>
              </tr>
              <tr>
                <td className="font-medium flex gap-1 border-b-4 border-gray-200 pb-2 pl-4">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  Coach Verified:
                </td>
                <td className="border-b-4 border-gray-200 pb-2">✅ Yes</td>
              </tr>
              <tr>
                <td className="font-medium flex gap-1 pl-4">
                  <CalendarClockIcon className="w-5 h-5 text-[#011F72]" />
                  Available From:
                </td>
                <td className="">Immediately</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-4 pt-8">
          {[
            { text: "Add to Shortlist", urlpath: "#" },
            { text: "Message", urlpath: "#" },
            {
              text: "Download CV",
              urlpath: "#",
            },
          ].map((item: PageLink, idx) => (
            <Link
              key={idx}
              href={item.urlpath}
              className="bg-white hover:bg-gray-300 text-blue-500 hover:font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 rounded-[10px] transition-all duration-200 ease-in-out hover:tracking-wider text-center w-full md:w-fit"
              aria-label={item.text}
            >
              {item.text} →
            </Link>
          ))}
        </div>
      </section>

      {/* Profile Overview */}
      <section
        className="px-4 py-10 sm:px-6 lg:px-16 bg-white text-gray-900"
        aria-labelledby="profile-overview-heading"
      >
        <h2
          id="profile-overview-heading"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
        >
          Profile Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Education */}
          <div
            className="rounded-[10px] p-6 bg-gray-100 shadow-md col-span-2"
            aria-labelledby="education-heading"
          >
            <h3
              id="education-heading"
              className="text-[1.5rem] mb-4 text-[#011F72] font-semibold flex items-center"
            >
              <GraduationCap size={30} className="mr-1" /> Education
            </h3>
            <ul className="list-disc ml-5 text-sm md:text-base">
              <li>
                B.Sc. in Economics, University of Ibadan <span>(2023)</span>
              </li>
              <li>
                Certification: Data Analytics (TechEdu Zoom Training, 2024)
              </li>
            </ul>
          </div>

          {/* Work & Internship History */}
          <div
            className="rounded-[10px] p-6 bg-gray-100 shadow-md col-span-3"
            aria-labelledby="work-history-heading"
          >
            <h3
              id="work-history-heading"
              className="text-[1.5rem] mb-4 text-[#011F72] font-semibold flex items-center"
            >
              <HiOutlineBriefcase size={30} className="mr-1" /> Work &
              Internship History
            </h3>
            <ul className="list-disc ml-5 text-sm md:text-base">
              <li>Internship: Research Assistant, EduLink NGO (Remote)</li>
              <li>Role: Analyzed 1,200+ responses using Excel + SPSS</li>
              <li>Internship: Customer Analyst, DataGrow Ltd (London)</li>
              <li>
                Achieved: Reduced churn insights by 12% via survey-based
                clustering
              </li>
            </ul>
          </div>

          {/* Soft Skills & Personality */}
          <div
            className="rounded-[10px] p-6 bg-gray-100 shadow-md col-span-3"
            aria-labelledby="soft-skills-heading"
          >
            <h3
              id="soft-skills-heading"
              className="text-[1.5rem] mb-4 text-[#011F72] font-semibold flex items-center"
            >
              <Lightbulb size={30} className="mr-1" /> Soft Skills & Personality
            </h3>
            <ul className="ml-3 list-inside text-sm md:text-base">
              <li>✔️ Analytical Thinking</li>
              <li>✔️ Communication</li>
              <li>✔️ Team Collaboration</li>
            </ul>
            <blockquote className="mt-4 italic text-gray-700 text-sm md:text-base border-l-4 pl-4 border-gray-400">
              "Punctual, coachable, and very articulate during mock interviews"
              <footer className="mt-1 text-right font-medium">
                — Career Coach
              </footer>
            </blockquote>
          </div>

          {/* Skills & Tools */}
          <div
            className="rounded-[10px] p-6 bg-gray-100 shadow-md col-span-2"
            aria-labelledby="skills-heading"
          >
            <h3
              id="skills-heading"
              className="text-[1.5rem] mb-4 text-[#011F72] font-semibold flex items-center"
            >
              <Laptop size={30} className="mr-1" /> Skills & Tools
            </h3>
            <dl className="text-sm md:text-base space-y-2">
              <div>
                <dt className="font-medium">Analytics</dt>
                <dd>Excel, SPSS, Power BI</dd>
              </div>
              <div>
                <dt className="font-medium">Research</dt>
                <dd>Survey Design, Data Cleaning</dd>
              </div>
              <div>
                <dt className="font-medium">Communication</dt>
                <dd>Report Writing, Public Speaking</dd>
              </div>
              <div>
                <dt className="font-medium">Languages</dt>
                <dd>English (Fluent), Yoruba</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CV Preview Panel */}
      <section
        className="px-4 py-10 sm:px-6 lg:px-16 bg-white text-gray-900"
        aria-labelledby="profile-overview-heading"
      >
        <h2
          id="profile-overview-heading"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
        >
          CV Preview Panel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {sanpleCV.map((item, index) => {
            return (
              <div
                key={index}
                className="rounded-[10px] px-6 py-8 flex flex-col items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <Image
                  src={item.img}
                  alt={item.desc}
                  width={300}
                  height={390}
                  className="text-white bg-gray-400 p-2 rounded-[8px] mb-6 shadow-lg"
                />
                <p className="text-base text-gray-800 text-center font-semibold">
                  Download
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="trusted-section"
        className="bg-gray-900 py-16 px-4 md:px-16 mx-auto"
      >
        {/* Trusted By */}
        <h2
          id="trusted-section"
          className="text-center text-3xl md:text-5xl font-extrabold gray-text-outline text-gray-900 uppercase mb-14"
        >
          CareerConnect Tags & Badges
        </h2>

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
              <p className="text-[1.2rem] mb-4 font-medium text-gray-100">
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
                { text: "Book a Discovery Call", href: "/contact" },
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

      <StoryCarousel
        stories={TalentFeedback}
        title="Talent feedback"
        paragraph="Notes from internal recruiters at your company"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />

      <section className="bg-gray-100 flex flex-col items-center py-16 px-4 md:px-16 mx-auto">
        <h2 className="text-center text-3xl md:text-5xl font-extrabold uppercase text-outline text-white pb-6">
          Action Bar
        </h2>
        <div className="flex flex-wrap gap-4 pt-8">
          {[
            { text: "Add to Shortlist", urlpath: "#" },
            { text: "Message", urlpath: "#" },
            {
              text: "Save Role to Folder",
              urlpath: "#",
            },
            {
              text: "Download CV",
              urlpath: "#",
            },
          ].map((item: PageLink, idx) => (
            <Link
              key={idx}
              href={item.urlpath}
              className="bg-white hover:bg-gray-300 text-[#011F72] hover:font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 rounded-[10px] transition-all duration-200 ease-in-out hover:tracking-wider text-center w-full md:w-fit"
              aria-label={item.text}
            >
              {item.text} →
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
