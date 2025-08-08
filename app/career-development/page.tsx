"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpenCheck,
  FileText,
  GraduationCap,
  Landmark,
  MicIcon,
  Target,
  Users2,
} from "lucide-react";
import ServicesAccordion from "@/components/AcademicServices/ServicesAccordion";
import StoryCarousel from "@/components/Stories/StoryCarousel";
import { LuRocket, LuPackage, LuScrollText } from "react-icons/lu";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { FiBriefcase } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
import HowItWorks from "@/components/HomePage/HowItWorks";
import CatalogPage from "@/components/CatalogPage";

const navigationItems = [
  { label: "Book a Discovery Call", href: "/book-call" },
  { label: "Try Our Tools", href: "/tools" },
  { label: "View Our Services", href: "/services" },
  { label: "About the Company", href: "/about" },
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

interface Story {
  name: string;
  role: string;
  image: string;
  review: string;
  country: string;
}

const stats = [
  { label: "CVs Built", value: "1k+" },
  { label: "Intervieds coached", value: "800+" },
  { label: "Shortlists landed", value: "500+" },
  { label: "Countries reached", value: "10+" },
];

const steps = [
  {
    id: 1,
    title: "Strategy Call",
    description: "We map your goals",
    badge: "1",
    side: "left" as const,
  },
  {
    id: 2,
    title: "Toolkits & Coaching",
    description: "CVs, Mock interviews,growth plan",
    badge: "2",
    side: "right" as const,
  },
  {
    id: 3,
    title: "Execution",
    description: "Apply, grow, get hired",
    badge: "3",
    side: "left" as const,
  },
];

const careerServices = [
  {
    id: 1,
    title: "CV Revamp ",
    icon: FileText,
    description: `Transform your CV into a standout document tailored to your target roles and industries.`,
  },
  {
    id: 2,
    title: "Interview Preparation",
    icon: Target,
    description: `Mock interviews, personalized coaching, and tips to help you succeed in job interviews.`,
  },
  {
    id: 3,
    title: "Career Coaching",
    icon: MicIcon,
    description:
      "Personalized career planning and skill-building sessions for professionals at all stages.",
  },
];

const realSuccessStories: Story[] = [
  {
    name: "Kim Hyu.",
    role: "Product Analyst",
    image: "/assets/real-career-stories-1.webp",
    review:
      "After using their CV and interview support, I got hired at a top tech firm in just 6 weeks.",
    country: "South Korea",
  },
  {
    name: "Shayla J.",
    role: "Graduate Trainee",
    image: "/assets/real-career-stories-2.webp",
    review:
      "CareerConnect helped me land two interviews and one offer — all in one month.",
    country: "UK",
  },
  {
    name: "Henry A.",
    role: "Brand Strategist",
    image: "/assets/real-career-stories-3.webp",
    review: "I've paid for career services before. Nothing worked like this.",
    country: "Germany",
  },
];

export default function CareerDevelopment() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDateChange = (value: any) => {
    setSelectedDate(value as Date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      // Here you would typically integrate with your booking system
      console.log(
        `Booking for ${selectedDate.toDateString()} at ${selectedTime}`
      );
      setShowConfirmation(true);
      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        // Reset selections
        setSelectedDate(null);
        setSelectedTime(null);
      }, 3000);
    }
  };
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
              Build a Career That Gets You Noticed
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pt-3 pb-[1.5rem]">
              Whether you're entering the job market, switching careers, or
              aiming for leadership roles—TechEdu Solution helps you craft your
              career intentionally. From CVs that open doors to coaching that
              builds confidence, our experts and tools are here to guide your
              next bold move.
            </p>

            <div className="pt-4">
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-6 py-4 rounded text-[1rem] font-medium transition "
              >
                Book a Free Discovery Call
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto lg:pt-[6rem] pb-4">
            {/* Image Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[22rem]">
              <Image
                src="/assets/career-development.webp"
                alt="Career Mentorship"
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
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

        {/* HOW IT WORKS */}
        <HowItWorks
          title="How It Works"
          steps={steps}
          resultLink={{
            text: "Book a Free Discovery Call",
            href: "/contact#discovery-call",
          }}
          primaryColor="green-600"
          secondaryColor="[#011F72]"
          className="bg-white"
        />
      </section>

      {/* <ServicesAccordion
        title="Career Development Services"
        services={careerServices}
        className="bg-gradient-to-b from-gray-50 to-white"
        buttonClassName="bg-white hover:bg-gray-50"
        iconClassName="text-indigo-600"
        panelClassName="bg-gray-50"
      /> */}

      <CatalogPage
        productType="Career Development & Mentorship"
        title="Career Development"
        description="Get expert career development services to excel in your career journey"
      />

      <StoryCarousel
        stories={realSuccessStories}
        title="Real Success Stories"
        className="bg-gradient-to-b from-gray-50 to-white"
        autoPlayInterval={5000}
      />

      {/* Short Video Description */}
      <section
        aria-labelledby="explainer-heading"
        className="py-16 px-4 md:px-16 mx-auto bg-blue-700"
      >
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="aspect-video w-full md:max-w-[60vw] md:h-[400px] rounded-[12px] overflow-hidden flex items-center justify-center">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/BPcDx2767nU?si=8gN4fk4yvX7KAB66"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              title="TechEdu Solution Explainer Video"
              frameBorder="0"
              // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
          <p className="text-white italic font-semibold text-[1rem] pt-6">
            Your Career Isn't Random. Let's Build It Together.
          </p>
        </div>
      </section>

      {/*  Choose Your Starting Point */}
      <section className="py-16 px-4 md:px-16 mx-auto text-center bg-white">
        <h2
          id="how-it-works"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
        >
          Choose Your Starting Point
        </h2>
        <p className="text-gray-700 mb-10">
          Designed for different levels. Choose your journey:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {[
            {
              icon: <LuGraduationCap size={45} />,
              title: "Final Year Student",
              desc: "",
              image: "",
              url: "/contact#discovery-call",
              action: "Book Coaching →",
            },
            {
              icon: <FiBriefcase size={45} />,
              title: "Mid-Career Professional",
              desc: "",
              image: "",
              url: "/tools/cv-builder",
              action: "Upgrade my CV →",
            },
            {
              icon: <LuRocket size={45} />,
              title: "Recent Graduate",
              desc: "",
              image: "",
              url: "/career-connect",
              action: "Launch CareerConnect →",
            },
            {
              icon: <Users2 size={45} />,
              title: "Employer or Recruiter",
              desc: "",
              image: "",
              url: "/career-connect/post-job",
              action: "Post a Job →",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-gray-50 space-y-3 rounded-[8px] shadow-sm p-8 flex flex-col items-center justify-between focus-within:ring-2 focus-within:ring-[#011F72] hover:shadow-md hover:bg-blue-50"
            >
              <span className="text-[#011F72] text-center group-hover:text-blue-500">
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
                type="button"
                className="inline-block w-full bg-blue-500 group-hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                aria-label={item.action}
              >
                {item.action}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Tools */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
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
              icon: <LuScrollText size={60} />,
              title: "Scholarship Coach",
              desc: "Application strategy & real-world templates",
              image: "",
              url: "/tools/scholarship-coach",
              action: "Get Help →",
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
              url: "/career-connect",
              action: "Visit →",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-white space-y-3 rounded-[8px] shadow-sm p-6 flex flex-col justify-between focus-within:ring-2 focus-within:ring-[#011F72] hover:shadow-md hover:bg-blue-50"
            >
              <span className="text-[#011F72] group-hover:text-blue-500">
                {item.icon}
              </span>
              <div>
                <h4 className="text-[1.4rem] font-semibold text-gray-900 group-hover:text-blue-500 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
              <Link
                href={item.url}
                className="inline-block self-end bg-[#0D1140] group-hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                aria-label={item.action}
              >
                {item.action}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Book a Delivery Call */}
      <section className="bg-white text-gray-900 py-16 px-4 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12">
            Book Your Free Delivery Call
          </h2>

          <div className="text-center max-w-2xl mx-auto">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Not sure where to start? Let's map it out together.
              </h3>
              <p className="text-sm md:text-base mb-4">
                Calls are 15–30 minutes with a real strategist — not a bot.
              </p>
              {/* <Link
                href="/contact"
                className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold mt-4 px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
              >
                Book a Free Discovery Call
              </Link> */}
            </div>

            <div className="bg-white rounded-[10px] shadow-sm p-4 mb-6">
              <p className="text-gray-600 text-sm mb-4">
                Use the calendar below to choose a time that works for you.
              </p>
              <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
                <div className="w-full md:w-auto">
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    minDate={new Date()}
                    className="border-none rounded-[10px]"
                    tileClassName={({ date }) =>
                      date < new Date() ? "opacity-50 cursor-not-allowed" : ""
                    }
                  />
                </div>
                {selectedDate && (
                  <div className="w-full md:w-64">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Available Time Slots
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          type="submit"
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`p-2 text-sm rounded-[8px] transition-all duration-200 ${
                            selectedTime === time
                              ? "bg-[#0D1140] text-white"
                              : "bg-blue-50 text-[#011F72] hover:bg-blue-100"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {selectedDate && selectedTime && (
                <div className="mt-6 relative">
                  <button
                    type="submit"
                    onClick={handleBooking}
                    className="bg-[#0D1140] text-white px-6 py-2 rounded-[8px] hover:bg-blue-700 transition-colors duration-200"
                  >
                    Confirm Booking
                  </button>
                  {showConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <div className="absolute inset-0 bg-black bg-opacity-50 animate-fadeIn" />
                      <div className="relative bg-white p-8 rounded-[10px] shadow-lg animate-scaleIn">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                            <svg
                              className="w-8 h-8 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Booking Confirmed!
                          </h3>
                          <p className="text-gray-600">
                            Your appointment has been scheduled successfully.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="relative text-black py-16 px-4 md:px-16">
          {/* <div className="absolute inset-0 bg-[url('/assets/library.webp')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-black/80" /> */}

          <div className="grid md:grid-cols-2 gap-6 items-center px-4 md:px-16 mx-auto">
            <div className="text-left">
              <h3 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-left pb-12">
                Still Have Questions?
              </h3>
              <p className="text-[1.2rem] mb-4">Reach out at</p>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                <Link
                  href="mailto:career@techedusolution.com"
                  className="hover:underline"
                >
                  career@techedusolution.com
                </Link>
              </h3>
              <p className="text-sm md:text-base mb-6">
                or visit our Contact Page
              </p>
            </div>
            <div className="flex justify-start md:justify-end">
              <Link
                href="/contact"
                className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
