import ClientStories from "@/components/HomePage/ClientStories";
import ExplainerVideo from "@/components/HomePage/ExplainerVideo";
import HeroCarousel from "@/components/HomePage/HeroCarousel";
import HowItWorks from "@/components/HomePage/HowItWorks";
import NewsletterFooter from "@/components/HomePage/NewsletterFooter";
import NotSureWhereToBegin from "@/components/HomePage/NotSureWhereToBegin";
import SmartTools from "@/components/HomePage/SmartToolsSection";
import SocialProof from "@/components/HomePage/SocialProof";
import StickyCTA from "@/components/HomePage/StickyCTA";
import WhatWeOfferSection from "@/components/HomePage/WhatWeOffer";
import WhyEduTechSection from "@/components/HomePage/WhyEduTecnSection";
import type { NextPage } from "next";
import Link from "next/link";

// Slide Data
const slides = [
  {
    id: 1,
    title: "Win that scholarship",
    description: "Craft proposals that win global funding with expert support.",
    path: "/tools/scholarship-coach",
    image: "/assets/students-celebrating-scholarship.webp",
    buttonText: "Explore",
  },
  {
    id: 2,
    title: "Build a CV that opens doors",
    description: "Use our drag-and-drop builder to design CVs recruiters love.",
    path: "/tools/cv-builder",
    image: "/assets/review-cv-at-hand.webp",
    buttonText: "Try Tool",
  },
  {
    id: 3,
    title: "Get job-ready with real coaching",
    description: "Practice interviews and career strategy, the smart way.",
    path: "/career-development",
    image: "/assets/career-session.webp",
    buttonText: "Explore",
  },
  {
    id: 4,
    title: "Lead smarter with data-driven training",
    description: "Train your team or yourself with actionable insights.",
    path: "/training",
    image: "/assets/data-driven-training.webp",
    buttonText: "Get Started",
  },
  {
    id: 5,
    title: "Connect with opportunity",
    description: "CareerConnect links graduates with employers in real-time.",
    path: "/career-connect",
    image: "/assets/career-session.webp",
    buttonText: "Explore",
  },
];

const steps = [
  {
    id: 1,
    title: "Choose your focus - Academic, Career, or Business",
    description: "",
    badge: "1",
    side: "left" as const,
  },
  {
    id: 2,
    title: "Explore services or tools tailored to your goals",
    description: "",
    badge: "2",
    side: "right" as const,
  },
  {
    id: 3,
    title: "Book a call, use our tools, or enroll directly",
    description: "",
    badge: "3",
    side: "left" as const,
  },
  {
    id: 4,
    title: "Track your journey through your dashboard",
    description: "",
    badge: "4",
    side: "right" as const,
  },
];

const Home: NextPage = () => {
  return (
    <>
      <header className="relative w-full px-4 pt-20 md:pt-24 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[84vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>

        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12 z-10">
          {/* Left: Hero Content */}
          <div className="space-y-6 text-center pt-16 md:pt-[7rem] xl:text-left xl:pt-[3.2rem]">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[80vw] text-white lg:leading-[3.5rem]">
              Accelerate Your Academic, Career
              <br /> & Business Journey
              <br />
              <span className="lg:w-4">—With Expert Guidance</span>
            </h1>
            <p className="text-md md:text-[1.2rem] leading-8 text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 pb-8 md:pb-[4rem]">
              From scholarship coaching to career strategy and business
              consulting, TechEdu Solution connects you with expert-led services
              and smart tools—so you grow faster, smarter, and stronger.
            </p>
            <Link
              href="/contact#discovery-call"
              className="bg-[#0D1140] hover:bg-blue-700 text-white px-6 py-4 text-center rounded text-[1rem] font-medium transition"
            >
              Book a Free Discovery Call
            </Link>
          </div>

          {/* Right: Carousel */}
          <HeroCarousel slides={slides} heightClass="h-[22rem]" />
        </div>
      </header>

      <WhyEduTechSection />

      <HowItWorks
        title="Your Career Journey"
        steps={steps}
        resultText="🎯 Result: Launch your career with confidence"
        primaryColor="[#011F72]"
        secondaryColor="indigo-600"
        className="bg-gray-100"
      />
      <WhatWeOfferSection />
      <SmartTools />
      <SocialProof />
      <ClientStories />
      <ExplainerVideo />
      <NotSureWhereToBegin />
      <NewsletterFooter />
    </>
  );
};

export default Home;
