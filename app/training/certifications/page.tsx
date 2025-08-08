import ServicesAccordion from "@/components/AcademicServices/ServicesAccordion";
import FAQAccordion from "@/components/FAQ/FAQAccordion";
import HowItWorks from "@/components/HomePage/HowItWorks";
import { BookOpenCheck, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

const academicSteps = [
  {
    id: 1,
    title: "Enroll in a Certified Course",
    badge: "1",
    side: "left" as const,
  },
  {
    id: 2,
    title: "Complete the Program Requirements",
    badge: "2",
    side: "right" as const,
  },
  {
    id: 3,
    title: "Pass Optional Final Task or Quiz (if applicable)",
    badge: "3",
    side: "left" as const,
  },
  {
    id: 4,
    title: "Receive Certificate via Email + Dashboard Access",
    badge: "4",
    side: "right" as const,
  },
];

const features = [
  {
    title: "Verifiable Credentials",
    description:
      "Each certificate includes a unique ID and QR code for employer verification",
    image: "/assets/certificate-verifiable.webp",
  },
  {
    title: "Recognized by Employers",
    description:
      "Built in collaboration with hiring managers and program partners",
    image: "/assets/certificate-recognized.webp",
  },
  {
    title: "Custom-Built Templates",
    description:
      "Designed with your program title, completion date, and instructor signature",
    image: "/assets/certificate-templates.webp",
  },
  {
    title: "Tamper-Proof Format",
    description:
      "Stored digitally, accessible anytime, can't be faked or altered",
    image: "/assets/certificate-tamperproof.webp",
  },
  {
    title: "Globally Shareable",
    description:
      "Attach to CVs, LinkedIn profiles, and scholarship applications with confidence",
    image: "/assets/certificate-global.webp",
  },
];

const services = [
  {
    id: 1,
    question: "Are these certificates internationally recognized?",
    answer:
      "Yes — while they're not university degrees, they are real-world, instructor-verified credentials. We've had learners use them in job applications, graduate school admissions, and funded fellowship programs.",
  },
  {
    id: 2,
    question: "Can I verify someone else's certificate?",
    answer:
      "Yes, using the certificate link or by submitting a manual request.",
  },
  {
    id: 3,
    question: "What if I lose access to my certificate?",
    answer:
      "Log in and go to Profile > My Certifications. You can re-download any verified record anytime.",
  },
  {
    id: 4,
    question: "Can I request a printed copy?",
    answer: "Yes. Printed delivery (£2,500 + shipping) available upon request.",
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
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[57vw] text-white">
              Your Training, Your Certificate, Your Edge
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pb-12">
              All TechEdu Solution training programs come with verifiable
              certificates — designed to showcase your skills, validate your
              effort, and open doors to real opportunities.
            </p>

            <div className="grid grid-cols-2 gap-4 xl:pt-8">
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
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[5.5rem] pb-4">
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

      <section
        className="
      py-16 px-4 md:px-12 bg-white"
        aria-labelledby="certificates-heading"
      >
        <div className=" max-w-4xl mx-auto">
          <h2
            id="certificates-heading"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
          >
            Why Our Certificates Matter
          </h2>

          <div className="space-y-16">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row ${
                    !isEven ? "md:flex-row-reverse" : ""
                  } items-center gap-4 md:gap-12`}
                >
                  {/* Image */}
                  <div className="w-full md:w-1/2 h-48 relative rounded-[15px] overflow-hidden border border-gray-200">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-16 bg-gray-100">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-12">
          Sample Certificate Preview
        </h2>

        <Image
          src="/assets/Certificate-Of-Achievement.png"
          alt="Certificate of Achievement sample"
          height={350}
          width={400}
          className="w-[450px] md:w-[600px] h-auto object-contain flex items-center justify-center mx-auto"
        />
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks
        title="Certificate Workflows"
        steps={academicSteps}
        primaryColor="green-600"
        secondaryColor="[#011F72]"
        className="bg-gray-100"
      />
      <div className="-mt-10 mb-16 text-center">
        <p className="font-bold">"Where do I find my certificates?"</p>
        <p>
          → All earned certificates are saved in your{" "}
          <span className="font-bold">Profile {">"} Certifications tab.</span>
        </p>
      </div>

      <section
        className="py-16 px-4 bg-white text-center"
        aria-labelledby="verify-certificate-heading"
      >
        <div className="max-w-md mx-auto">
          <h2
            id="verify-certificate-heading"
            className="text-2xl font-bold text-gray-900"
          >
            For Employers or Institutions
          </h2>

          <p className="mt-4 text-md text-gray-700">
            Want to verify a certificate?
          </p>

          <div className="mt-6 md:mt-12 space-y-4">
            <Link
              href="/verify-certificate"
              className="w-full inline-flex justify-center items-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              aria-label="Enter Certificate ID to verify"
            >
              Enter Certificate ID{" "}
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>

            <Link
              href="/support/verification"
              className="w-full inline-flex justify-center items-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              aria-label="Request verification help"
            >
              Request Verification Help
            </Link>

            <Link
              href="/sample-validation-report"
              className="w-full inline-flex justify-center items-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              aria-label="View sample validation report"
            >
              View Sample Validation Report{" "}
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <FAQAccordion
        title="Frequently Asked Questions"
        faqs={services}
        className="bg--gray-100"
        buttonClassName="bg-white hover:bg-gray-50"
        iconClassName="text-indigo-600"
        panelClassName="bg-gray-50"
      />

      <section
        className="py-16 px-4 bg-white text-center"
        aria-labelledby="verify-certificate-heading"
      >
        <div className="max-w-md mx-auto">
          <div className="mt-6 md:mt-12 space-y-4">
            <Link
              href="/verify-certificate"
              className="w-full inline-flex justify-center items-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              aria-label="Enter Certificate ID to verify"
            >
              See Certified Programs →
            </Link>

            <Link
              href="/career-connect/employers"
              className="w-full inline-flex justify-center items-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              aria-label="Request verification help"
            >
              Explore CareerConnect for Employers →
            </Link>

            <Link
              href="/sample-validation-report"
              className="w-full inline-flex justify-center items-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              aria-label="View sample validation report"
            >
              Contact Us for Certificate Support →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
