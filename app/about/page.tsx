"use client";

import Link from "next/link";
import HeroCarousel from "@/components/HomePage/HeroCarousel";
import OurStory from "@/components/AboutUsPage/OurStory";
import WhoWeServe from "@/components/AboutUsPage/WhoWeServe";
// import OurGlobalImpact from "@/components/AboutUsPage/OurGlobalImpact";
import WhatWeOffer from "@/components/AboutUsPage/WhatWeOffer";
import PeopleStories from "@/components/AboutUsPage/PeopleStories";
import TrustedSection from "@/components/AboutUsPage/TrustedBy";
import ExploreMore from "@/components/AboutUsPage/ExploreMore";
import MeetTheTeam from "@/components/AboutUsPage/MeetTheTeam";
import GlobalImpactSection from "@/components/AboutUsPage/OurGlobalImpact";
import Image from "next/image";

export default function Contact() {
  return (
    <>
      <header className="mx-auto px-4 md:px-16 pt-16 pb-16 flex flex-col items-center justify-center text-center bg-[#0D1140] h-full w-full md:h-[70vh]">
        <p className="text-5xl font-bold text-gray-200 pb-4 pt-20">About Us</p>
        <h1 className="text-lg font-medium text-white sm:text-xl">
          Empowering Growth Through Expert-Led Learning and Career Innovation.
        </h1>
      </header>

      {/* About us Presentation by Author */}
      <section className="pt-20 px-4 md:px-16 mx-auto relative w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center xl:text-left pb-2">
          From a Personal Mission to a Global Platform
        </h1>
        {/* Foreground Content */}
        <div className="relative z-10">
          {/* Content with floating image on the left */}
          <div className="space-y-4 text-center md:text-left md:pt-[6rem] xl:text-left xl:pt-8">
            <div className="md:float-left md:w-[380px] w-full max-w-xl mx-auto md:mr-6 mb-4 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/Precious-The-Founder.png"
                alt="Precious Akaighe, Founder & Principal Consultant"
                className="w-full h-auto object-cover"
                height={720}
                width={720}
              />
            </div>
            <p className="text-md text-gray-600 md:text-[1rem] lg:max-w-full mx-auto xl:mx-0 text-justify">
              Precious Akaighe is the Founder and Principal Consultant of
              TechEdu Solution Ltd, a dynamic consultancy at the forefront of
              technology, education, leadership training, and digital
              transformation. With a distinguished career spanning the public
              and private sectors, she brings over a decade of strategic
              expertise in business analysis, project delivery, change
              management, applied AI governance, and education consulting.
            </p>
            <p className="text-md text-gray-600 md:text-[1rem] md:leading-7 text-justify">
              Precious is a multi-certified professional, holding qualifications
              that reflect her breadth of knowledge and commitment to excellence
              as a Senior Business Analyst, Certified Agile Business Analyst,
              Project Management Professional (PMP), Lean Six Sigma Yellow Belt
              Professional, Certified in Change Management, Applied Generative
              AI Professional, and AI Ethics and Governance Specialist.
            </p>
            <p className="text-md text-gray-600 md:text-[1rem] md:leading-7 text-justify">
              Her proven track record includes leading large-scale initiatives
              in data migration and management, financial systems
              transformation, application development, enterprise change, and
              strategic leadership development. She is especially passionate
              about helping organisations harness the power of AI responsibly,
              with a strong focus on AI governance frameworks, ethical AI
              deployment, and compliance with emerging regulations.
            </p>
            <p className="text-md text-gray-600 md:text-[1rem] md:leading-7 text-justify">
              In addition to her consulting work, Precious is a Professional
              Career Coach and Mentor, dedicated to empowering individuals to
              break into and thrive in the tech, business analysis, and
              leadership space. Through tailored coaching programmes and
              hands-on mentorship, she supports early- and mid-career
              professionals in achieving their career goals with confidence.
            </p>
            <p className="text-md text-gray-600 md:text-[1rem] md:leading-7 text-justify">
              She also delivers Business Analysis Training, Leadership
              Development Workshops, and Education Consulting, equipping
              learners and organisations with the technical, strategic, and
              communication skills they need to succeed in evolving industries.
              By integrating leadership training into TechEdu Solution Ltd's
              offerings, she helps professionals and businesses build
              sustainable strategies for innovation, growth, and impactful
              decision-making.
            </p>
            <p className="text-md text-gray-600 md:text-[1rem] md:leading-7 text-justify">
              Through TechEdu Solution Ltd, Precious champions a mission of
              inclusive innovation, ethical leadership, and practical
              empowerment, helping businesses and individuals alike to thrive in
              the digital future.
            </p>
            <p className="text-[1.2rem] font-semibold leading-4 mb-10">
              Precious
              <br />
              <span className="text-[12px] italic">
                Founder & Principal Consultant
              </span>
            </p>
            <div className="clear-both" />
            {/* <button
              type="button"
              className="bg-[#0D1140] group-hover:bg-blue-700 text-white px-6 py-3 rounded text-[1rem] font-medium transition"
            >
              Watch the Founder Story →
            </button> */}
          </div>
        </div>
      </section>

      {/* About us Presentation by Senior Consultant */}
      <section className="pt-8 pb-24 px-4 md:px-16 mx-auto relative w-full">
        {/* Foreground Content with floating image on the right */}
        <div className="relative z-10">
          <div className="space-y-4 text-center md:text-left xl:text-left xl:pt-8">
            <div className="md:float-right md:w-[380px] w-full max-w-xl mx-auto md:ml-6 mb-4 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/Dr-Godbless-Akaighe.png"
                alt="Dr. Godbless Akaighe"
                className="w-full h-auto object-cover"
                height={720}
                width={720}
              />
            </div>
            <p className="text-md text-gray-600 md:text-[1rem] text-justify">
              Dr. Godbless Akaighe is a Senior Lecturer at a UK university with
              over a decade of experience in the Higher Education sector and
              more than 20 years of service as a teacher, mentor, youth leader,
              children's educator, and life coach. His passion for personal
              development and empowering individuals to reach their full
              potential has shaped his career in teaching, research,
              administration, and mentoring across universities in Africa and
              Europe.
            </p>
            <p className="text-md text-gray-600 md:text-[1rem] md:leading-7 text-justify">
              He holds a Bachelor's degree in Business Administration, a
              Master's degree in Organisational Behaviour (Distinction), and a
              PhD in Management (Work Psychology) from the University of
              Sheffield, UK, where he was awarded a fully funded scholarship.
              His doctoral research focused on the dynamics between narcissistic
              leaders and team members.
            </p>
            <p className="text-md text-gray-600 md:text-[1rem] md:leading-7 text-justify">
              Dr. Akaighe is a Fellow of the Higher Education Academy (FHEA) and
              has published extensively in the fields of leadership,
              organisational behaviour, human resource management, work
              psychology, and management. He also serves as an Associate Editor
              for a British-rated academic journal.
            </p>
            <p className="text-md text-gray-600 md:text-[1rem] md:leading-7 text-justify">
              In addition to his academic contributions, Dr. Akaighe has
              extensive experience in consulting and mentoring within both
              profit and non-profit sectors. He has trained leaders, team
              members, and students, supervised numerous Master's theses, and is
              actively involved in doctoral supervision, PhD examinations, and
              external examining of Leadership and Management programmes at UK
              universities.
            </p>
            <p className="text-md text-gray-600 md:text-[1rem] md:leading-7 text-justify">
              He is widely regarded as a go-to mentor for young people, helping
              them discover their purpose and navigate their academic and
              professional journeys. As a scholarship coach, he supports
              students in understanding international university admissions and
              scholarship processes, developing research proposals, refining
              manuscripts for publication, and managing the complexities of
              postgraduate research, whether at the Master's or PhD level.
            </p>
            <p className="text-[1.2rem] font-semibold leading-4 mb-10">
              Dr. Godbless Akaighe
              <br />
              <span className="text-[12px] italic">
                Senior Lecturer | Senior Consultant |Researcher | Mentor |
                Leadership & Scholarship Coach
              </span>
            </p>
            <div className="clear-both" />
            {/* <button
              type="button"
              className="bg-[#0D1140] group-hover:bg-blue-700 text-white px-6 py-3 rounded text-[1rem] font-medium transition"
            >
              Watch the Founder Story →
            </button> */}
          </div>
        </div>
      </section>

      {/* Our Mission & Our Vision */}
      <section className="relative w-full bg-gray-200 text-gray-700 py-16 md:py-0">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 md:px-16 px-4">
          {/* Mission */}
          <div className="relative space-y-6 text-center md:py-24 flex flex-col items-center justify-center">
            <div className="flex justify-center items-center gap-2">
              {/* Mission Icon */}
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3a9 9 0 110 18 9 9 0 010-18z"
                />
              </svg>
              <h2 className="text-3xl font-bold text-black">Our Mission</h2>
            </div>
            <p className="text-opacity-90 leading-relaxed max-w-md text-center">
              Our mission at TechEdu Solution Ltd is to empower individuals and
              businesses by providing innovative, technology-driven solutions
              that inspire growth and enable success. Through our tailored
              educational services and professional consultancy, we strive to
              simplify learning, foster career excellence, and deliver
              measurable impact for our clients. At the heart of our mission is
              a commitment to quality, integrity, and the transformative power
              of education.
            </p>
          </div>

          {/* Divider Line (only on desktop) */}
          <div
            className="hidden md:block absolute left-1/2 top-0 h-full w-[9px] bg-white/30 transform -translate-x-1/2"
            aria-hidden="true"
          />

          {/* Vision */}
          <div className="relative space-y-6 text-center md:py-24 flex flex-col items-center justify-center">
            <div className="flex justify-center items-center gap-2">
              {/* Vision Icon */}
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h2 className="text-3xl font-bold text-black">Our Vision</h2>
            </div>
            <p className="text-opacity-90 leading-relaxed max-w-md text-center">
              To be the leading platform that empowers learners and
              professionals with cutting-edge educational and career advancement
              solutions, fostering innovation, growth, and success in a rapidly
              evolving world.
            </p>
          </div>
        </div>
      </section>
      <OurStory />
      <WhoWeServe />
      <GlobalImpactSection />
      <WhatWeOffer />
      <PeopleStories />
      <TrustedSection />
      <MeetTheTeam />
      <ExploreMore />
    </>
  );
}
