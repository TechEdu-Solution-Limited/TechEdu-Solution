import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import TraniningPackages from "@/components/TraniningPackages";
import {
  Award,
  BookOpenCheck,
  BrainCircuit,
  Briefcase,
  ChartBar,
  Landmark,
  LayoutDashboard,
  LucideIcon,
  Package,
  Presentation,
  UserCog,
  Users,
  Verified,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type PlatformFeaturesItem = {
  icon: LucideIcon;
  title?: string;
  desc?: string;
};

const platformFeatures: PlatformFeaturesItem[] = [
  {
    icon: Presentation,
    title: "Instructor-Led Zoom Classes",
    desc: "Real-time engagement, discussion, and participation",
  },
  {
    icon: Verified,
    title: "Verifiable Certifications",
    desc: "Issued with each cohort, branded and QR-coded",
  },
  {
    icon: ChartBar,
    title: "Team Performance Dashboards",
    desc: "Optional score tracking, feedback collection, attendance",
  },
  {
    icon: Users,
    title: "Cohort-Based Learning",
    desc: "Communication, Team Collaboration, Leadership",
  },
  {
    icon: Package,
    title: "Custom Bundles",
    desc: "Real-time engagement, discussion, and participation",
  },
];

const adsOn: PlatformFeaturesItem[] = [
  {
    icon: Award,
    desc: "Internal Certificates + Employer Endorsement",
  },
  {
    icon: LayoutDashboard,
    desc: "Employer Dashboard Access",
  },
  {
    icon: ChartBar,
    desc: "Talent Screening Reports (via CareerConnect)",
  },
];

const Stories: Story[] = [
  {
    name: "Damilola A.",
    country: "UK",
    image: "/assets/damilola.webp",
    review:
      "I landed my first analyst internship with the help of the training certificate and project template.",
    role: "Graduate Trainee",
  },
  {
    name: "Michael O.",
    country: "UK",
    image: "/assets/michael.webp",
    review:
      "We trained 8 employees across 2 branches and saw instant improvement in their reports.",
    role: "Operations Manager",
  },
];

const whoIsForitFeatures = [
  { icon: <BookOpenCheck size={60} />, label: "Corporates & Startups" },
  { icon: <Landmark size={60} />, label: "NGOs & Ministries" },
  { icon: <Briefcase size={60} />, label: "Schools & Research Institutes" },
  {
    icon: <UserCog size={60} />,
    label: "Schools & Research Institutes",
  },
  {
    icon: <BrainCircuit size={60} />,
    label: "Skill & Employability Projects",
  },
];

const plans = [
  {
    plan: "Starter Teams",
    description: "5–10 users, pre-built courses",
    pricing: "£40,000 – £75,000 total",
  },
  {
    plan: "Growth Teams",
    description: "11–30 users, customized flow",
    pricing: "From £120,000",
  },
  {
    plan: "Partner Programs",
    description: "31+ users, branding, dashboards",
    pricing: "Custom Pricing",
  },
];

const page = () => {
  return (
    <>
      <header className="relative w-full px-8 pt-20 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[80vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-8 text-center md:pt-[6rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[59vw] text-white">
              Upskill Your Team. Certify Their Growth.
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pb-16">
              Our Zoom-based training programs are designed for teams,
              departments, and entire organizations looking to drive measurable
              outcomes with verifiable certificates.
            </p>

            <div className="grid grid-cols-2 gap-4 xl:pt-4">
              <Link
                href="/contact#contact-form"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Request a Training Proposal
              </Link>
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Book a Free Discovery Call
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[6rem] pb-4">
            {/* Image Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[22rem]">
              <Image
                src="/assets/group-of-traning-people.webp"
                alt="corporate team training online"
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white py-16 px-4 md:px-16 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white">
            Who It's For
          </h2>
        </div>

        <ul
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto"
          aria-label="Platform Support Services"
        >
          {whoIsForitFeatures.map((feature, index) => (
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
      </section>

      <section className="py-20 px-4 md:px-16 bg-gray-100">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-12">
          What’s Included in Every Team Package
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {platformFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-gray-200 rounded-[10px] shadow-sm px-3 py-7 flex flex-col items-center"
              >
                <Icon
                  size={60}
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

      <TraniningPackages />

      <StoryCarousel
        stories={Stories}
        title="Real Impact, Real People"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />

      <section
        aria-labelledby="upcoming-cohorts-heading"
        className="bg-white py-20 px-4 md:px-16 mx-auto"
      >
        <h2
          id="upcoming-cohorts-heading"
          className="text-3xl md:text-5xl font-extrabold text-outline text-center uppercase text-white mb-10"
        >
          Upcoming Cohorts & Live Sessions
        </h2>

        <div className="overflow-x-auto">
          <table
            className="w-full border-separate border-spacing-y-2"
            aria-describedby="upcoming-cohorts-heading"
          >
            <thead>
              <tr className="text-left text-md font-semibold text-gray-700 border-b border-gray-300">
                <th scope="col" className="pb-2">
                  Plan
                </th>
                <th scope="col" className="pb-2">
                  Description
                </th>
                <th scope="col" className="pb-2">
                  Pricing
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr
                  key={index}
                  className="text-md text-gray-800 border-b border-gray-200"
                >
                  <td className="py-4 border-b-2 border-gray-400">
                    {plan.plan}
                  </td>
                  <td className="py-4 border-b-2 border-gray-400">
                    {plan.description}
                  </td>
                  <td className="py-4 border-b-2 border-gray-400">
                    {plan.pricing}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 w-fit mt-8">
          <Link
            href="/contact#discovery-call"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            View Full Schedule →
          </Link>
          <Link
            href="/get-started"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            Enroll in a Program →
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 md:px-16 bg-gray-100">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-12">
          Optional Ads-On
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {adsOn.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-[10px] px-4 py-7 flex flex-col items-center"
              >
                <Icon
                  size={70}
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
          href="/training/certification"
          className="bg-gray-300 hover:text-gray-800 flex justify-center w-fit mx-auto mt-12 text-[#011F72] px-6 py-3 rounded text-[1rem] font-medium transition"
        >
          Learn How Certification Works →
        </Link>
      </section>

      <section
        aria-labelledby="explore-more"
        className="py-20 px-8 md:px-16 mx-auto bg-gray-50 text-center"
      >
        <div className="grid md:grid-cols-2 gap-6 items-center px-4 md:px-16 mx-auto">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white pb-10">
              Still Not Sure Where to Start?
            </h2>
            <p className="text-gray-700 mb-10">
              Finding your perfect path shouldn't be overwhelming — whether
              you're a student, jobseeker, or team lead, we're here to guide
              your next step with clarity. Explore your options or speak
              directly with a strategist to get personalized support.
            </p>
          </div>
          <div className="flex flex-col justify-start md:justify-end gap-3 w-full sm:w-fit md:ml-auto">
            <Link
              href="/contact#discovery-call"
              className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
            >
              Book a Free Discovery Call →
            </Link>
            <Link
              href="/contact#discovery-call"
              className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
            >
              Explore FAQs →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
