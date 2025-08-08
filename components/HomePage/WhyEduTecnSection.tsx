"use client";

import Image from "next/image";
import Link from "next/link";

export default function WhyEduTechSection() {
  return (
    <section
      aria-labelledby="why-techedu-heading"
      className="bg-white py-16 px-4 xl:px-16 mx-auto"
    >
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2
          id="why-techedu-heading"
          className="text-3xl md:text-5xl font-extrabold text-[#002647] mb-4"
        >
          <span className="uppercase text-outline text-white">
            Why TechEdu Solution?
          </span>
        </h2>
        <p className="text-gray-800 text-lg">
          At TechEdu Solution, we don’t just offer services—we walk with you
          from challenge to achievement. Whether you{"'"}re a student,
          jobseeker, or business leader, we give you the structure, tools, and
          expert support to achieve your next goal.
        </p>
      </div>

      {/* Grid Layout */}
      <div
        arial-role="list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {/* Card 1 */}
        <Link
          href="/academic-services"
          arial-role="listitem"
          className="p-6 hover:rounded-[12px] hover:shadow-md transition cursor-pointer"
        >
          <Image
            src="/assets/student-with-mentor.webp"
            alt="Student receiving academic mentoring"
            width={400}
            height={250}
            className="w-full h-auto rounded-[8px] mb-4"
            priority
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Academic Growth Without Guesswork
          </h3>
          <ul className="space-y-2 text-gray-800 list-disc list-inside">
            <li>PhD &amp; Master{"'"}s mentoring</li>
            <li>Thesis review &amp; research coaching</li>
            <li>Scholarship strategy and personal branding</li>
            <li>Academic Research Publication Support</li>
          </ul>
        </Link>

        {/* Card 2 */}
        <Link
          href="/career-development"
          arial-role="listitem"
          className="p-6 hover:rounded-[12px] hover:shadow-md transition cursor-pointer"
        >
          <Image
            src="/assets/cv-building.webp"
            alt="Career coach guiding student through mock interview process"
            width={400}
            height={250}
            className="w-full h-auto rounded-[8px] mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Careers That Don’t Just Happen—They’re Built
          </h3>
          <ul className="space-y-2 text-gray-800 list-disc list-inside">
            <li>CV building and optimization</li>
            <li>Mock interviews &amp; prep</li>
            <li>Graduate visibility via CareerConnect</li>
          </ul>
        </Link>

        {/* Card 3 */}
        <Link
          href="/corporate-consultancy"
          arial-role="listitem"
          className="p-6 hover:rounded-[12px] hover:shadow-md transition cursor-pointer"
        >
          <Image
            src="/assets/corporate-training.webp"
            alt="Corporate team in leadership training"
            width={400}
            height={250}
            className="w-full h-auto rounded-[8px] mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Smart Support for Smarter Companies
          </h3>
          <ul className="space-y-2 text-gray-800 list-disc list-inside">
            <li>Corporate consultancy</li>
            <li>Leadership training</li>
            <li>Business analysis training</li>
            <li>Custom service bundles</li>
          </ul>
        </Link>
      </div>
    </section>
  );
}
