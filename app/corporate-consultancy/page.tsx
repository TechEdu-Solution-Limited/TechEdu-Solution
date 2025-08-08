"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpenCheck,
  GraduationCap,
  Briefcase,
  BarChart2,
  Building2,
  Users,
  Brain,
  Rocket,
  Database,
  ShieldCheck,
  Settings2,
} from "lucide-react";
import ServicesAccordion from "@/components/AcademicServices/ServicesAccordion";
import {
  FaGraduationCap,
  FaLaptopCode,
  FaFileAlt,
  FaQuoteLeft,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import CatalogPage from "@/components/CatalogPage";

interface CaseStudy {
  icon: React.ElementType;
  title: string;
  challenge: string;
  solution: string;
  result: string;
}

const caseStudies: CaseStudy[] = [
  {
    icon: FaGraduationCap,
    title: "Lead University, London",
    challenge: "Low thesis completion rate",
    solution: "Mentorship and thesis editing support",
    result: "47% improvement in completion time",
  },
  {
    icon: FaLaptopCode,
    title: "Fintech Startup, Abuja",
    challenge: "Hiring skilled junior analysts",
    solution: "CareerConnect screening and mock interviews",
    result: "2x faster shortlisting and 1 hire per week",
  },
  {
    icon: FaFileAlt,
    title: "DataGrow Inc.",
    challenge: "Disconnected performance reporting",
    solution: "Dashboard + training for 3 teams",
    result: "80% increase in reporting adoption",
  },
];

const stats = [
  { label: "Client Satisfaction", value: "94%" },
  { label: "Orginizations Served", value: "60+" },
  { label: "Institutional Programs Delivered", value: "20+" },
  { label: "Countries reached", value: "10+" },
];

// const corporateConsultancy = [
//   {
//     id: 1,
//     title: "Data-Driven Decision Support",
//     icon: BarChart2,
//     description:
//       "Get clarity from complexity. We help organizations simplify data, visualize results, and guide performance.",
//     details: [
//       "Custom KPIs and impact dashboards",
//       "Academic or HR analytics",
//       "Decision-support frameworks",
//     ],
//     cta: {
//       label: "Book a Demo →",
//       href: "/contact#discovery-call",
//     },
//   },
//   {
//     id: 2,
//     title: "Team & Leadership Training",
//     icon: Users,
//     description:
//       "Build team capacity with real-world learning tracks and hands-on upskilling. Delivered live or hybrid.",
//     details: [
//       "Soft skills & data literacy programs",
//       "Zoom-based training with tracked engagement",
//       "Leadership development sprints",
//     ],
//     cta: {
//       label: "Browse Training Catalog →",
//       href: "/career-connect",
//     },
//   },
//   {
//     id: 3,
//     title: "Hiring & Talent Strategy",
//     icon: Briefcase,
//     description:
//       "Reduce hiring friction and level up your workforce with ready-to-deploy tools.",
//     details: [
//       "CareerConnect recruiter dashboard",
//       "CV screening & mock interview workflows",
//       "Role-specific skills benchmarking",
//     ],
//     cta: {
//       label: "Explore Employer Tools →",
//       href: "/career-connect/talents",
//     },
//   },
//   {
//     id: 4,
//     title: "Institutional Academic Consulting",
//     icon: GraduationCap,
//     description:
//       "Partner with us to improve postgraduate outcomes, track research impact, or manage student support at scale.",
//     details: [
//       "Mentorship program systems",
//       "Research output tracking tools",
//       "Thesis coaching frameworks",
//     ],
//     cta: {
//       label: "Request an Institutional Partnership →",
//       href: "/contact",
//     },
//   },
// ];

const corporateConsultancy = [
  {
    id: 1,
    title: "Business Analysis Training",
    icon: BarChart2,
    description:
      "Comprehensive training programs covering techniques, methodologies, and tools for business analysis.",
  },
  {
    id: 2,
    title: "Professional Consultancy",
    icon: Users,
    description:
      "Strategic advice and tailored solutions for companies looking to optimize operations and achieve their goals.",
  },
  {
    id: 3,
    title: "Leadership and management consultancy",
    icon: Briefcase,
    description:
      "Corporate training on leadership, teamwork, managing small and large teams and all aspects of organisational growth, efficiency and development.",
  },
  {
    id: 4,
    title: "Academic Data Analysis",
    icon: Database,
    description:
      "Statistical support and advanced analytics for academic research projects.",
  },
  {
    id: 5,
    title: "AI Ethics Consultation",
    icon: ShieldCheck,
    description:
      "Guidance on responsible AI use, fairness, transparency, and regulatory compliance.",
  },
  {
    id: 6,
    title: "AI Governance Framework",
    icon: Settings2,
    description:
      "Comprehensive guidelines and strategies for responsible AI deployment, ensuring ethical oversight, transparency, accountability, fairness, and regulatory compliance.",
  },
  {
    id: 7,
    title: "Enterprise AI Governance",
    icon: Building2,
    description:
      "Tailored governance solutions for businesses and organizations, integrating AI risk management, compliance monitoring, and ethical AI practices into corporate operations.",
  },
];

const features = [
  {
    icon: <BookOpenCheck size={60} />,
    label: "Universities & Research Hubs",
  },
  {
    icon: <Building2 size={60} />,
    label: "Government Ministries & Education Boards",
  },
  {
    icon: <Briefcase size={60} />,
    label: "Startups & SMEs",
  },
  {
    icon: <Users size={60} />,
    label: "HR & People Ops Teams",
  },
  {
    icon: <Brain size={60} />,
    label: "Directors of Learning, Data & Strategy",
  },
];

const feature = [
  {
    icon: <BookOpenCheck size={40} />,
    h4: "Data Dashboard",
    paragraph: "Bundle services and preview pricing",
    url: "/pricing",
    pathName: "View Sample →",
  },
  {
    icon: <BookOpenCheck size={40} />,
    h4: "CareerConnect Employers",
    paragraph: "Post jobs, assess CVs, shortlist candidates",
    url: "/career-connect/employers",
    pathName: "Use Now →",
  },
  {
    icon: <BookOpenCheck size={40} />,
    h4: "Package Estimator",
    paragraph: "Bundle services and preview pricing",
    url: "/tools/package-estimator/start#estimator-wizard-steps",
    pathName: "Try It →",
  },
];

const packages = [
  {
    id: 1,
    title: "Startup Builder Kit",
    subtitle: "Growth-phase startups",
    icon: Rocket,
    bullets: ["Talent systems", "Team analytics"],
    buttonLabel: "Book Consultation",
    url: "/contact#discovery-call",
  },
  {
    id: 2,
    title: "Institution Partner Plan",
    subtitle: "Universities & Ministries",
    icon: GraduationCap,
    bullets: ["Mentorship", "Dashboards", "Training"],
    buttonLabel: "Request Access",
    url: "/contact",
  },
  {
    id: 3,
    title: "Enterprise Upleveling",
    subtitle: "HR & L&D teams",
    icon: Briefcase,
    bullets: ["Skill mapping", "KPI coaching"],
    buttonLabel: "Browse Solutions",
    url: "/career-connect",
  },
];

export default function CorporateConsultancy() {
  return (
    <>
      <header className="relative w-full px-4 pt-20 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[83vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-6 text-center md:pt-[6rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[63vw] text-white">
              Smart Solutions for Smarter Organizations
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 pb-[2rem]">
              At TechEdu Solution, we help institutions, teams, and leaders
              unlock growth with strategic consulting, actionable data, and
              performance-driven training. Whether you're building a workforce,
              tracking academic outcomes, or leveling up decision-making—we
              co-design real solutions that scale with you.
            </p>

            <div className="">
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-6 py-4 rounded text-[1rem] font-medium transition "
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
                src="/assets/corporate-consultancy.webp"
                alt="corporate consultacy team performance analytics"
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
                className="flex flex-col items-center justify-center w-[calc(50%-2rem)] sm:w-[calc(33.333%-2rem)] md:w-[calc(25%-2rem)]"
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

      {/* WE COLABORATE WITH */}
      <section className="bg-white py-16 md:py-20 px-4 md:px-16 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white">
            Who We Serve
          </h2>
          <p className="mt-4 md:mt-8 text-gray-700 font-semibold text-base sm:text-lg leading-relaxed">
            We collaborate with:
          </p>
        </div>

        <ul
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto"
          aria-label="Platform Support Services"
        >
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-md shadow-sm bg-gray-100"
              tabIndex={0}
              aria-label={feature.label}
            >
              <span className="bg-gray-300 text-gray-800 px-4 py-3 transition focus-within:ring-2 focus-within:ring-[#011F72]">
                {feature.icon}
              </span>
              <span className="text-sm font-medium">{feature.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* <ServicesAccordion
        title="Corporate Consultancy Services"
        services={corporateConsultancy}
        className="bg-gradient-to-b from-gray-50 to-white"
        buttonClassName="bg-white hover:bg-gray-50"
        iconClassName="text-indigo-600"
        panelClassName="bg-gray-50"
      /> */}

      <CatalogPage
        productType="Marketing, Consultation & Free Services"
        title="Corporate Consultancy Services"
        description="Get expert corporate consultancy services, mentorship, and support to excel in your corporate journey"
      />

      {/* HOW WE'VE HELPED */}
      <section
        id="how-we-helped"
        aria-labelledby="how-we-helped-heading"
        className="py-20 bg-blue-700 scroll-mt-16"
      >
        <Link
          href="#how-we-helped"
          id="skip-how-we-helped"
          tabIndex={-1}
          className="sr-only"
        >
          Skip to How We Helped
        </Link>

        <div className="max-w-5xl px-4 mx-auto">
          <h2
            id="how-we-helped-heading"
            className="text-3xl md:text-5xl font-extrabold uppercase gray-text-outline text-blue-700 text-center pb-12"
          >
            How We've Helped
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((cs, i) => (
              <article
                key={i}
                className="group relative p-8 bg-gray-100 rounded-2xl shadow-sm text-left transition hover:shadow-md"
                tabIndex={0}
                aria-labelledby={`case-${i}-title`}
              >
                <cs.icon
                  className="w-14 h-14 bg-blue-200 p-2 rounded-[10px] text-[#011F72] mb-5"
                  size={60}
                  aria-hidden="true"
                />

                <h3
                  id={`case-${i}-title`}
                  className="text-center text-base font-bold text-[#011F72] mt-2"
                >
                  {cs.title}
                </h3>

                <p className="mt-6 text-center text-sm text-gray-800 leading-relaxed">
                  <span className="font-semibold">Challenge:</span>{" "}
                  {cs.challenge}
                </p>
                <p className="mt-1 text-center text-sm text-gray-800 leading-relaxed">
                  <span className="font-semibold">Solution:</span> {cs.solution}
                </p>
                <p className="mt-1 text-center text-sm text-gray-800 leading-relaxed">
                  <span className="font-semibold">Result:</span> {cs.result}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WORK WITH US */}
      <section
        className="bg-gray-50 py-16 px-4 md:px-8"
        aria-labelledby="why-work-heading"
      >
        <h2
          id="why-work-heading"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
        >
          Why Work With Us
        </h2>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Quote Section */}
          <div className="md:w-[40%] text-center md:text-left">
            <blockquote className="relative pl-10 text-gray-800 text-lg font-medium italic">
              <span
                className="absolute left-0 top-0 text-5xl leading-none text-[#EAF5FC]/50"
                aria-hidden="true"
              >
                <FaQuoteLeft size={200} />
              </span>
              <span className="relative z-20">
                Organizations don't grow by accident
                <br />
                —they grow by insight and execution.
              </span>
              <cite className="relative z-20 not-italic block mt-4 text-sm font-semibold text-gray-900">
                — Precious, Founder
              </cite>
            </blockquote>
          </div>

          {/* Video Section with iframe */}
          <div className="relative z-10 md:w-1/2 w-full aspect-video bg-gray-300 rounded-xl shadow-md overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your actual video URL
              title="Why Work With Us Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            ></iframe>
          </div>
        </div>
      </section>

      {/* PRE-BUILT PACKAGES */}
      <section className="bg-white py-16 md:py-20 px-4 md:px-16 mx-auto">
        <h2
          id="how-it-works"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
        >
          Pre-Built Packages for Fast Onboarding
        </h2>
        <p className="text-gray-700 mb-10 text-center">
          Customizable consulting bundles for institutions, startups, and HR
          teams.
        </p>

        <div className="max-w-6xl mx-auto border-y border-gray-200 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {packages.map(
              ({
                id,
                title,
                subtitle,
                icon: Icon,
                bullets,
                buttonLabel,
                url,
              }) => (
                <div
                  key={id}
                  className="flex flex-col items-center text-center px-6 py-10 space-y-4"
                >
                  <Icon
                    className="w-8 h-8 text-blue-500 mb-2"
                    aria-hidden="true"
                  />
                  <h3 className="text-lg font-semibold text-blue-500">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-700">{subtitle}</p>
                  <ul className="text-sm text-gray-800 list-disc list-inside text-left">
                    {bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                  <Link
                    href={url}
                    className="mt-4 bg-blue-500 text-sm font-semibold text-white px-4 py-2 rounded hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    aria-label={buttonLabel}
                  >
                    {buttonLabel} →
                  </Link>
                </div>
              )
            )}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl pt-6 text-center font-semibold">
          Enterprise Tools That Power Our Consulting
        </h3>
        <ul
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
          aria-label="Platform Support Services"
        >
          {feature.map((features, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-md shadow-sm bg-gray-100"
              tabIndex={0}
              aria-label={features.h4}
            >
              <span className="bg-gray-300 text-gray-800 px-5 py-8 transition focus-within:ring-2 focus-within:ring-[#011F72]">
                {features.icon}
              </span>
              <div className="px-3 pr-5">
                <h4 className="text-[1rem] font-medium">{features.h4}</h4>
                <p className="text-sm">{features.paragraph}</p>
                <div className="flex justify-end w-full">
                  {features.url ? (
                    <Link
                      href={features.url}
                      className="text-sm font-bold hover:underline"
                    >
                      {features.pathName}
                    </Link>
                  ) : (
                    <span className="text-sm font-bold">
                      {features.pathName}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="not-sure-heading"
        className="grid md:grid-cols-2 gap-6 items-center px-4 py-20 md:px-16 mx-auto bg-white"
      >
        <div>
          <h2
            id="not-sure-heading"
            className="text-3xl md:text-5xl font-extrabold mb-8 uppercase text-outline text-white"
          >
            Let's Design Your Solution Together
          </h2>
          <p className="font-semibold text-gray-800 mb-3">
            Every organization is different. Let's schedule a discovery call to
            assess your goals and outline the best track forward.
          </p>
          <p className="flex items-center gap-2">
            <MdEmail size={28} className="text-[#011F72] flex-shrink-0" />
            <Link
              href="mailto:contact@techedusolution.com"
              className="text-[1rem] text-black font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:underline"
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
            Book a Free Strategy Session
          </Link>
        </div>
      </section>
    </>
  );
}
