import CatalogPage from "@/components/CatalogPage";
import TalentListPage from "@/components/TalentsPage";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface PageLink {
  text: string;
  urlpath: string;
}

const TalentsPage = () => {
  return (
    <div>
      <header className="mx-auto px-4 md:px-16 pt-16 pb-16 flex flex-col items-center justify-center text-center bg-[#0D1140] h-full w-full md:h-[80vh]">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white sm:text-xl pb-4 pt-20">
          Explore Our Training Programs
        </h1>
        <p className="text-lg text-gray-200 font-medium">
          Browse all available training programs, filter by topic, level, or
          learning path, and start your certification journey today.
        </p>
      </header>

      <TalentListPage />

      <section className="bg-white py-16 px-4 md:px-16 mx-auto">
        <div className="bg-gray-200 flex flex-wrap justify-center gap-4 px-6 py-10 sm:p-12 md:p-24 rounded-[15px]">
          {[
            { text: "View Training Schedule", urlpath: "/training" },
            { text: "View Pricing Options", urlpath: "/pricing" },
            {
              text: "Contact for Group Access",
              urlpath: "/contact#discovery-call",
            },
          ].map((item: PageLink, idx) => (
            <Link
              key={idx}
              href={item.urlpath}
              className="bg-white hover:bg-gray-300 font-semibold hover:font-bold text-[#011F72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 rounded-[10px] transition-all duration-200 ease-in-out hover:tracking-wider w-fit"
              aria-label={item.text}
            >
              {item.text} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TalentsPage;
