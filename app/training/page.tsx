import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import {
  Award,
  Briefcase,
  ChartBar,
  Handshake,
  LucideIcon,
  QrCode,
  SquareArrowOutUpRight,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

const features = [
  {
    title: "Live via Zoom",
    description: "Real-time interaction and Q&A with expert instructors",
    image: "/assets/live-zoom.webp",
    alt: "Illustration representing live zoom sessions",
  },
  {
    title: "Short & Focused",
    description: "Most courses are 2–6 weeks. Learn and apply immediately",
    image: "/assets/time-management.webp",
    alt: "Illustration representing focused learning",
  },
  {
    title: "Certificate of Completion",
    description:
      "Get recognized proof, verifiable by employers and institutions",
    image: "/assets/online-certificate.webp",
    alt: "Illustration representing certificate",
  },
  {
    title: "Soft + Hard Skills",
    description: "Learn communication, analytics, business tools, leadership",
    image: "/assets/business-strategy.webp",
    alt: "Illustration representing skills development",
  },
  {
    title: "Real-World Projects",
    description: "Build portfolios, not just pass quizzes",
    image: "/assets/building-portfolio.webp",
    alt: "Illustration representing project work",
  },
];

const platformFeatures: PlatformFeaturesItem[] = [
  {
    icon: ChartBar,
    title: "Data & Research",
    desc: "Data Analytics with Excel, Research Writing, Survey Design",
  },
  {
    icon: TrendingUp,
    title: "Career Skills",
    desc: "Public Speaking, CV Writing, Interview Coaching",
  },
  {
    icon: Briefcase,
    title: "Business & Tools",
    desc: "Strategic Planning, Notion for Productivity, Microsoft Suite",
  },
  {
    icon: Handshake,
    title: "Soft Skills",
    desc: "Communication, Team Collaboration, Leadership",
  },
];

const certificate: PlatformFeaturesItem[] = [
  {
    icon: Award,
    desc: "Every participant receives a verifiable certificate",
  },
  {
    icon: QrCode,
    desc: "Certificates come with unique QR codes for validation",
  },
  {
    icon: SquareArrowOutUpRight,
    desc: "Certificates can be added to your CV, LinkedIn, and CareerConnect profile",
  },
];

const audiences: Audience[] = [
  {
    id: "individuals",
    icon: <User size={30} className="text-gray-700" />,
    title: "Individuals & Graduates",
    items: [
      "Boost your CV with verified skills",
      "Prepare for job interviews with confidence",
      "Learn what's missing from your degree",
    ],
    linkText: "Explore for Individuals",
    href: "/training/individuals",
  },
  {
    id: "teams",
    icon: <Users size={30} className="text-gray-700" />,
    title: "Teams & Organizations",
    items: [
      "Upskill employees in a measurable way",
      "Tailor programs to specific roles or sectors",
      "Certify training completion across departments",
    ],
    linkText: "See Team Options",
    href: "/training/teams",
  },
];

const LearnerSays: Story[] = [
  {
    name: "Kemi O.",
    country: "UK",
    image: "/assets/damilola.webp",
    review:
      "We trained 18 entry-level staff in 2 weeks. The certificates and dashboards helped us present HR impact to our directors.",
    role: "HR Lead, AgriTech Firm",
  },
  {
    name: "Chuka D.",
    country: "UK",
    image: "/assets/michael.webp",
    review:
      "TechEdu Solution allowed us to run regional NGO training entirely via Zoom with live sessions and attendance sheets.",
    role: "Programs Officer",
  },
];

const plans = [
  {
    program: "Data Analytics Bootcamp",
    startDate: "July 8",
    format: "Zoom Live",
  },
  {
    program: "Research Writing",
    startDate: "July 15",
    format: "Zoom Live",
  },
  {
    program: "Career Communication Master",
    startDate: "Aug 5",
    format: "Zoom Live",
  },
];

const page = () => {
  return (
    <>
      <header className="relative w-full px-4 pt-20 md:pt-24 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[80vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[80vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-8 text-center md:pt-[6rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold  xl:w-[48vw] text-white">
              Skill Up with Zoom-Based Training & Certificates Backed by Real
              Results
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pb-8">
              Whether you're building your career or upskilling your team, Tech
              Edu Solution delivers practical, instructor-led training programs
              — fully online, certified, and designed for immediate impact.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/training/catalog"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Browse Training Catalog
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
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[5rem] pb-4">
            {/* Image Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[24rem]">
              <Image
                src="/assets/online-instructor-led-course.avif"
                alt="corporate consultacy team performance analytics"
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      <section
        className="bg-white py-20 px-4 sm:px-6 md:px-16"
        aria-labelledby="employer-benefits"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2
            id="employer-benefits"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
          >
            What Makes Our Training Different
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-[10px] p-6 transition hover:shadow-lg focus-within:shadow-md"
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

      <section
        aria-labelledby="who-its-for-heading"
        className="bg-white px-4 sm:px-6 md:px-16"
      >
        <div className="bg-gray-100 px-4 py-12 rounded-2xl max-w-6xl mx-auto">
          <h2
            id="who-its-for-heading"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
          >
            Who It's For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-16">
            {audiences.map((audience) => (
              <div
                key={audience.id}
                className="p-6 rounded-xl flex flex-col justify-between h-full"
                aria-labelledby={`${audience.id}-heading`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="bg-gray-300 p-3 rounded-[8px]"
                      aria-hidden="true"
                    >
                      {audience.icon}
                    </div>
                    <h3
                      id={`${audience.id}-heading`}
                      className="text-lg font-semibold text-gray-900"
                    >
                      {audience.title}
                    </h3>
                  </div>

                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    {audience.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <Link
                    href={audience.href}
                    className="inline-block bg-[#0D1140] group-hover:bg-blue-700 justify-center w-fit mx-auto text-white px-6 py-3 rounded-[10px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-700"
                  >
                    {audience.linkText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-16 bg-white">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-12">
          Platform Features at a Glance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {platformFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-gray-200 rounded-[10px] shadow-sm px-4 py-7 flex flex-col items-center"
              >
                <Icon
                  size={50}
                  className="text-black bg-gray-400 p-2 rounded-[16px] mb-3"
                />
                <h3 className="text-[1rem] text-gray-800 text-center mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-800 text-center">{item.desc}</p>
              </div>
            );
          })}
        </div>
        <Link
          href="/training/catalog"
          className="bg-gray-200 hover:bg-gray-300 flex justify-center w-fit mx-auto mt-12 text-[#011F72] px-6 py-3 rounded text-[1rem] font-medium transition"
        >
          Browse Full Catalog →
        </Link>
      </section>

      <section className="py-16 px-4 md:px-16 bg-gray-100">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-12">
          Your Certificate, Your Edge
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {certificate.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="rounded-[10px] px-4 py-7 flex flex-col items-center"
              >
                <Icon
                  size={50}
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

      <StoryCarousel
        stories={LearnerSays}
        title="What Our Learners Say"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />

      <section
        aria-labelledby="upcoming-cohorts-heading"
        className="max-w-6xl mx-auto px-4 py-16"
      >
        <h2
          id="upcoming-cohorts-heading"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
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
                  Program
                </th>
                <th scope="col" className="pb-2">
                  Start Date
                </th>
                <th scope="col" className="pb-2">
                  Format
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr
                  key={index}
                  className="text-md text-gray-800 border-b border-gray-200"
                >
                  <td className="py-4 border-b-2 border-gray-400 max-w-[6rem] md:max-w-none">
                    {plan.program}
                  </td>

                  <td className="py-4 border-b-2 border-gray-400">
                    {plan.startDate}
                  </td>
                  <td className="py-4 border-b-2 border-gray-400">
                    <span className=" px-3 py-[6px] rounded-full bg-black text-white">
                      {plan.format}
                    </span>
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
            href="/contact#discovery-call"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            Enroll in a Program →
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="explore-more"
        className="py-20 px-4 md:px-16 mx-auto bg-gray-50 text-center"
      >
        <h2
          id="explore-more"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
        >
          Pricing That Works For Everyone
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link
            href="/get-started"
            className="bg-gray-200 hover:bg-gray-300 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 rounded-[10px] transition-all duration-200 ease-in-out hover:tracking-wider"
            aria-label="Enroll in a Program"
          >
            Enroll in a Program →
          </Link>
        </div>
        <p className="text-[1rem] text-gray-800 text-center font-semibold mb-10">
          Pay once. Learn for life. Certificates included.
        </p>

        <div className="grid md:grid-cols-2 gap-6 items-center md:px-16 mx-auto">
          <div className="text-left">
            <h3 className="text-2xl font-bold text-blue-500 mb-2">
              Still Not Sure Where to Start?
            </h3>
            <p className="text-gray-700 mb-6 md:mb-10">
              Finding your perfect path shouldn't be overwhelming — whether
              you're a student, jobseeker, or team lead, we're here to guide
              your next step with clarity. Explore your options or speak
              directly with a strategist to get personalized support.
            </p>
          </div>
          <div className="flex flex-col justify-start md:justify-end gap-3 w-full md:w-fit ml-auto">
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
