"use client";

import Link from "next/link";
import "react-calendar/dist/Calendar.css";

export default function NotSureWhatYouNeed() {
  return (
    <section
      aria-labelledby="not-sure-heading"
      className="grid md:grid-cols-2 gap-6 items-center px-4 py-20 md:px-16 mx-auto bg-white"
    >
      <div>
        <h2
          id="not-sure-heading"
          className="text-3xl md:text-5xl font-extrabold text-[#002647] mb-8"
        >
          <span className="uppercase text-outline text-white">
            Not Sure What You Need? Let’s Talk
          </span>
        </h2>
        <p className="font-semibold text-gray-800 mb-3">
          Growth often starts with clarity. Let’s explore your goals together.
        </p>
        <p className="text-gray-800">
          Book a free 15–30 minute session with an academic advisor. We’ll
          recommend the most effective track based on your needs.
        </p>
      </div>
      <div className="flex justify-start md:justify-end">
        <Link
          href="/contact#discovery-call"
          className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
        >
          Book a Free Discovery Call
        </Link>
      </div>
    </section>
  );
}
