import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import TraniningPackages from "@/components/TraniningPackages";
import {
  Award,
  ChartBar,
  LayoutDashboard,
  LucideIcon,
  QrCode,
  SquareArrowOutUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

type PlatformFeaturesItem = {
  icon: LucideIcon;
  title?: string;
  desc?: string;
};
interface Audience {
  id: string;
  icon: React.ReactNode;
  title: string;
  items: string[];
  linkText: string;
  href: string;
}

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

const certificate: PlatformFeaturesItem[] = [
  {
    icon: Award,
    desc: "Add to your CV or job applications",
  },
  {
    icon: QrCode,
    desc: "Boost your CareerConnect profile",
  },
  {
    icon: SquareArrowOutUpRight,
    desc: "Share on LinkedIn with confidence",
  },
];

const Stories: Story[] = [
  {
    name: "Damilola A.",
    image: "/assets/damilola.webp",
    review:
      "My CV improved so much after the coaching sessions. I got two interviews within a week.",
    role: "TechEdu Training Graduate",
  },
  {
    name: "Michael O.",
    image: "/assets/michael.webp",
    review:
      "Learning Excel properly helped me pass my internship screening test. Thank you!",
    role: "Final-Year Student",
  },
];

const plans = [
  {
    plan: "Starter Teams",
    price: "£0",
    include: "Sample classes, no certificate",
  },
  {
    plan: "Smart Starter",
    price: "£2,500/one-time",
    include: "Course access + training docs",
  },
  {
    plan: "Career Launch Pro",
    price: "£5,000/one-time",
    include: "Full course + certificate + CV review",
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
          <div className="space-y-6 text-center md:pt-[6rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[59vw] text-white">
              Launch Your Career With Practical, Certified Skills
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pb-12">
              Designed for graduates, students, and early-career professionals,
              our Zoom-based programs help you build the exact skills employers
              want — with verified certificates to prove it.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link
                href="/training/catalog"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Browse Courses
              </Link>
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Book a Call With a Coach
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[6rem] pb-4">
            {/* Image Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[22rem]">
              <Image
                src="/assets/young-serious-busy-professional-business.webp"
                alt="young professionals online training"
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      <TraniningPackages />

      <section className="py-16 px-4 md:px-16 bg-gray-100">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center ">
          Get a Certificate That Stands Out
        </h2>
        <p className="mb-12"></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {certificate.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-[10px] px-4 py-7 flex flex-col items-center"
              >
                <Icon
                  size={80}
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
          className="bg-gray-200 hover:bg-gray-300 flex justify-center w-fit mx-auto mt-12 text-[#011F72] px-6 py-3 rounded text-[1rem] font-medium transition"
        >
          Learn How Certification Works →
        </Link>
      </section>

      <section
        aria-labelledby="what-we-offer-heading"
        className="bg-blue-700 py-16 px-4 md:px-16 mx-auto"
      >
        <h2
          id="what-we-offer-heading"
          className="text-3xl md:text-5xl font-extrabold uppercase gray-text-outline text-blue-700 text-center"
        >
          Why Students Choose Us
        </h2>

        {/* Core Services */}
        <div className="my-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between md:max-w-4xl mx-auto gap-6">
            {/* Service List */}
            <ul className="list-none space-y-4 text-white text-base max-w-md">
              {[
                "Taught Live — No boring recordings",
                "Zoom-Based — Learn from anywhere",
                "Coach-Reviewed CVs — For Pro learners",
                "Fast-Track Format — 1 to 4 weeks only",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center">
                  <span aria-hidden="true" className="text-white mr-2 mt-[2px]">
                    <IoIosCheckmarkCircleOutline size={30} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Illustration Placeholder or Static Image */}
            <div
              aria-hidden="true"
              className="w-full md:w-[400px] aspect-video bg-blue-100 rounded-[8px] flex items-center justify-center"
            >
              <Image
                src="/assets/virtual-training-.webp"
                alt="Illustration showing core services"
                height={200}
                width={400}
                className="object-contain rounded-[8px]"
              />
            </div>
          </div>
        </div>
      </section>

      <StoryCarousel
        stories={Stories}
        title="Success Stories"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />

      <section
        aria-labelledby="upcoming-cohorts-heading"
        className="bg-white py-20 px-4 md:px-16 mx-auto"
      >
        <h2
          id="upcoming-cohorts-heading"
          className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10"
        >
          Flexible Plans
        </h2>

        <div className="overflow-x-auto">
          <table
            className="w-full border-separate border-spacing-y-2"
            aria-describedby="upcoming-cohorts-heading"
          >
            <thead>
              <tr className="text-left text-md font-semibold text-gray-700 border-b border-gray-300">
                <th scope="col" className="pb-2">
                  Plan Name
                </th>
                <th scope="col" className="pb-2">
                  Price
                </th>
                <th scope="col" className="pb-2">
                  Includes
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
                    {plan.price}
                  </td>
                  <td className="py-4 border-b-2 border-gray-400">
                    {plan.include}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 w-fit mt-8">
          <Link
            href="/pricing"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            View Pricing →
          </Link>
          <Link
            href="/get-started"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            Join Now →
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="explore-more"
        className="grid md:grid-cols-2 gap-6 items-center py-20 px-8 md:px-16 mx-auto bg-gray-50"
      >
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-700">
            Empower your team or yourself with training that’s designed for
            outcomes, not overwhelm. Whether you need targeted upskilling or
            full-scale workforce development, we’ll help you build a plan that
            delivers real results.
          </p>
        </div>
        <div className="flex flex-col justify-start md:justify-end gap-3 w-full sm:w-fit md:ml-auto">
          <Link
            href="/training/catalog"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            Book Full Catalog →
          </Link>
          <Link
            href="/contact#discovery-call"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            Book Free Consultation →
          </Link>
          <Link
            href="/login"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            Log in to Enroll →
          </Link>
        </div>
      </section>
    </>
  );
};

export default page;
