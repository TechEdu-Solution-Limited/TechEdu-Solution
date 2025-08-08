import HowItWorks from "@/components/HomePage/HowItWorks";
import StoryCarousel, { Story } from "@/components/Stories/StoryCarousel";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const templates = [
  {
    title: "Formatted for Applicant Tracking Systems (ATS)",
    image: "/templates/cv_1.webp",
    alt: "Icon representing verified graduate profiles",
    url: "#",
  },
  {
    title: "Uses smart sectioning for different career stages",
    image: "/templates/cv_2.webp",
    alt: "Icon representing employer feedback",
    url: "#",
  },
  {
    title: "Adaptable across industries and global markets",
    image: "/templates/cv_3.webp",
    alt: "Icon representing mock interview coaching",
    url: "#",
  },
  {
    title: "Showcases design used in real job-winning CVs",
    image: "/templates/cv_4.webp",
    alt: "Icon representing talent pool tagging",
    url: "#",
  },
  {
    title: "Formatted for Applicant Tracking Systems (ATS)",
    image: "/templates/cv_5.webp",
    alt: "Icon representing verified graduate profiles",
    url: "#",
  },
  {
    title: "Uses smart sectioning for different career stages",
    image: "/templates/cv_6.webp",
    alt: "Icon representing employer feedback",
    url: "#",
  },
  {
    title: "Adaptable across industries and global markets",
    image: "/templates/cv_7.webp",
    alt: "Icon representing mock interview coaching",
    url: "#",
  },
  {
    title: "Showcases design used in real job-winning CVs",
    image: "/templates/cv_8.webp",
    alt: "Icon representing talent pool tagging",
    url: "#",
  },
  {
    title: "Showcases design used in real job-winning CVs",
    image: "/templates/cv_9.webp",
    alt: "Icon representing talent pool tagging",
    url: "#",
  },
  {
    title: "Showcases design used in real job-winning CVs",
    image: "/templates/cv_10.webp",
    alt: "Icon representing talent pool tagging",
    url: "#",
  },
];

const features = [
  {
    title: "Formatted for Applicant Tracking Systems (ATS)",
    image: "/assets/cv-review.webp",
    alt: "Icon representing verified graduate profiles",
  },
  {
    title: "Uses smart sectioning for different career stages",
    image: "/assets/search-talent-filter.webp",
    alt: "Icon representing employer feedback",
  },
  {
    title: "Adaptable across industries and global markets",
    image: "/assets/data-driven.webp",
    alt: "Icon representing mock interview coaching",
  },
  {
    title: "Showcases design used in real job-winning CVs",
    image: "/assets/contact-application.webp",
    alt: "Icon representing talent pool tagging",
  },
];

const RealSuccessStories: Story[] = [
  {
    name: "Tina A.",
    image: "/assets/ngozi.webp",
    review:
      "I used TechEdu's guide to win a DAAD PhD scholarship in Germany. The structure changed everything.",
    role: "Development Researcher",
  },
  {
    name: "David M.",
    image: "/assets/david.webp",
    review:
      "What we liked most was the coaching report attached to some applicants' profiles. It gave us more than just a CV.",
    role: "Chevening Scholar",
  },
];

const page = () => {
  return (
    <>
      <header className="relative w-full px-8 pt-20 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[72vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-6 text-center md:pt-[4rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[57vw] text-white">
              Explore CVs That Get Interviews
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pb-12">
              Browse a range of sample CVs created with TechEdu Solution's CV
              Builder — formatted for impact, role-specific, and aligned with
              global hiring standards.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-8">
              <Link
                href="/cv-builder/start"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Start Building My CV
              </Link>
              <Link
                href="#"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                Try the Free Version
              </Link>
              <Link
                href="/contact#discovery-call"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-3 py-4 rounded text-[1rem] font-medium transition"
              >
                See CV Builder Features
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[6rem] pb-4">
            {/* Image Container */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-[16rem] md:h-[22rem]">
              <Image
                src="/assets/people-graduating-with-diplomas.webp"
                alt="people-graduating-with-diplomas"
                className="w-full h-full"
                height={200}
                width={250}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Featured Sample CVs */}
      <section
        className="bg-gray-50 py-20 px-4 sm:px-6 md:px-16"
        aria-labelledby="featured-sample-cvs"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2
            id="featured-sample-cvs"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
          >
            Featured Sample CVs
          </h2>

          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-center">
            {templates.map((template, index) => (
              <div
                key={index}
                className="group relative transition overflow-hidden rounded-md shadow-sm"
                role="group"
                tabIndex={0}
                aria-labelledby={`feature-title-${index}`}
              >
                {/* Image Wrapper */}
                <div className="relative w-full aspect-[1/1.414]">
                  <Image
                    src={template.image}
                    alt={template.alt}
                    fill
                    className="object-cover w-full h-full select-none"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Link
                    id={`feature-title-${index}`}
                    href={template.url}
                    className="text-sm font-medium text-white hover:text-gray-300 px-4 py-2 transition"
                  >
                    View Sample →
                  </Link>
                  <Link
                    href={template.url}
                    className="text-sm font-medium text-white hover:text-gray-300 px-4 py-2 transition"
                  >
                    Create This CV →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why These Samples Works*/}
      <section
        className="bg-gray-50 py-20 px-4 sm:px-6 md:px-16"
        aria-labelledby="employer-benefits"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2
            id="employer-benefits"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
          >
            Why These Samples Work
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 justify-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-[15px] transition hover:shadow-lg focus-within:shadow-md"
                role="group"
                tabIndex={0}
                aria-labelledby={`feature-title-${index}`}
              >
                <div className="w-full h-[200px] relative">
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    fill
                    className="object-cover rounded-[15px] "
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
                <h3
                  id={`feature-title-${index}`}
                  className="text-lg font-semibold text-gray-800 p-6"
                >
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoryCarousel
        stories={RealSuccessStories}
        title="Real Success Stories"
        className="bg-gradient-to-b from-white to-blue-50"
        autoPlayInterval={4500}
      />
    </>
  );
};

export default page;
