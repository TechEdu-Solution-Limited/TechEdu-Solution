"use client";

import Link from "next/link";
import Image from "next/image";
import SmartTools from "@/components/AcademicServices/SmartToolsToAccelerate";
import StudentSuccessStories from "@/components/AcademicServices/StudentSuccessStories";
import HowAcademicWorks from "@/components/AcademicServices/HowAcademicWorks";
import ServicesAccordion from "@/components/AcademicServices/ServicesAccordion";
import NotSureWhatYouNeed from "@/components/AcademicServices/NotSureWhatYouNeed";
import {
  BookOpenCheck,
  FileText,
  GraduationCap,
  Landmark,
  BookOpen,
  Edit,
} from "lucide-react";
import CatalogPage from "@/components/CatalogPage";

const services = [
  {
    id: 1,
    title: "PhD Mentoring",
    icon: BookOpenCheck,
    description:
      "Personalized guidance for doctoral candidates, including support with research proposals, developing doctoral thinking an world-class research ideas, literature reviews, methodology, and academic writing.",
  },
  {
    id: 2,
    title: "PhD Admission and Scholarship",
    icon: FileText,
    description:
      "Training on seeking doctoral admissions and scholarships in the social science field.",
  },
  {
    id: 3,
    title: "General Mentoring and Pastoral Care",
    icon: GraduationCap,
    description:
      "Providing tailor-made one-on-one mentoring, life coaching on finding purpose and direction in life, academic and career.",
  },
  {
    id: 4,
    title: "Academic Transition Training",
    icon: Landmark,
    description:
      "Training on academic transition from one cultural context to another. How to succeed and robustly engage and integrate into an international education and psychological context.",
  },
  {
    id: 5,
    title: "Master's Project Supervision",
    icon: BookOpen,
    description:
      "Expert advice and supervision for Master's students, ensuring their projects meet academic and professional standards.",
  },
  {
    id: 6,
    title: "Thesis Review & Editing",
    icon: Edit,
    description:
      "Detailed feedback and professional editing to enhance the quality and presentation of your thesis.",
  },
  {
    id: 7,
    title: "Academic Research Publication Support",
    icon: FileText,
    description:
      "Training on academic writing and developing manuscripts for publications in top-tier social science journals.",
  },
];

export default function AcademicServices() {
  return (
    <>
      <header className="relative w-full px-4 pt-20 md:pt-16 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[80vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-6 text-center md:pt-[6rem] xl:text-left xl:pt-12">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[63vw] text-white">
              Academic Mentorship That Moves You Forward
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 pb-[3rem]">
              Whether you're writing your first research proposal or preparing
              for your PhD defense, TechEdu Solution gives you expert guidance
              every step of the way. We remove confusion, build your confidence,
              and help you hit real milestones—locally and internationally.
            </p>
            <div>
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-6 py-4 rounded text-[1rem] font-medium transition "
              >
                Book a Free Discovery Call
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[7rem] pb-4">
            {/* Image Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[22rem]">
              <Image
                src="/assets/student-mentor.webp"
                alt="Student and mentor in the library"
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>
      <HowAcademicWorks />
      {/* <ServicesAccordion
        title="Academic Services"
        services={services}
        className="bg-gradient-to-b from-gray-50 to-white"
        buttonClassName="bg-white hover:bg-gray-50"
        iconClassName="text-indigo-600"
        panelClassName="bg-gray-50"
      /> */}

      <CatalogPage
        productType="Academic Support Services"
        title="Academic Support Services"
        description="Get expert academic assistance, mentorship, and support to excel in your educational journey"
      />

      <StudentSuccessStories />
      <SmartTools />
      <NotSureWhatYouNeed />
    </>
  );
}
