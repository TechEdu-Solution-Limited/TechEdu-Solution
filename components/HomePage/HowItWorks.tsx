"use client";
import { FileText } from "lucide-react";
import Link from "next/link";

interface Step {
  id: number;
  title?: string;
  description?: string | string[]; // <-- allows both string and array of strings
  badge: string;
  side: "left" | "right";
}

interface HowItWorksProps {
  title?: string;
  steps: Step[];
  resultLink?: {
    text: string;
    href: string;
  };
  resultText?: string;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  path?: string;
}

export default function HowItWorks({
  title = "How it Works",
  steps,
  resultText,
  resultLink,
  className = "",
}: HowItWorksProps) {
  return (
    <main className="pb-20">
      <section className={`relative w-full py-12 ${className}`}>
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            id="how-techedu-works-heading"
            className="text-3xl md:text-5xl font-extrabold text-[#002647] mb-4"
          >
            <span className="uppercase text-outline text-white">{title}</span>
          </h2>
        </div>
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2 z-0 hidden md:block mt-28"></div>

        <div className="space-y-12 md:space-y-24">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between"
            >
              {/* Left Column (Desktop only) */}
              <div className="hidden md:flex md:w-1/2 px-4 md:pr-12 justify-end">
                {step.side === "left" && (
                  <div
                    className={`bg-white rounded-[8px] shadow-md p-6 border-r-[10px] border-[#011F72] max-w-md`}
                  >
                    <h3 className="text-lg font-bold text-[#002647]">
                      {step.title}
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                      {Array.isArray(step.description) &&
                        step.description.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Mobile Layout */}
              <div className="flex md:hidden items-start gap-4 px-4">
                {/* Timeline Dot for mobile */}
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`bg-white border-2 rounded-[14px] shadow flex items-center justify-center w-12 h-12 ${
                      index % 2 !== 0 ? `border-[#011F72]` : `border-green-600`
                    }`}
                  >
                    <FileText
                      className={`p-2 ${
                        index % 2 !== 0 ? `text-[#011F72]` : `text-green-600`
                      }`}
                      size={40}
                    />
                  </div>
                  <span
                    className={`text-white text-xs px-2 py-0.5 rounded-[6px] ${
                      index % 2 !== 0 ? `bg-[#0D1140]` : `bg-green-600`
                    }`}
                  >
                    {step.badge}
                  </span>
                </div>

                {/* Content Box for mobile (always border-left) */}
                <div
                  className={`bg-white rounded-[8px] shadow-md p-4 border-l-[6px] max-w-sm w-full
          text-sm text-gray-600
                    ${
                      index % 2 === 0 ? `border-[#011F72]` : `border-green-600`
                    }`}
                >
                  <h3 className="text-base font-semibold text-[#002647] mb-1">
                    {step.title}
                  </h3>
                  <p>{step.description}</p>
                </div>
              </div>

              {/* Timeline Dot for Desktop (centered) */}
              <div className="hidden md:flex flex-col items-center w-20 shrink-0 space-y-2">
                <div
                  className={`bg-white border-2 rounded-[14px] shadow flex items-center justify-center w-16 h-16 ${
                    index % 2 === 0 ? `border-[#011F72]` : `border-green-600`
                  }`}
                >
                  <FileText
                    className={`p-3 ${
                      index % 2 === 0 ? `text-[#011F72]` : `text-green-600`
                    }`}
                    size={60}
                  />
                </div>
                <span
                  className={`text-white text-sm px-3 py-1 rounded-[8px] ${
                    index % 2 === 0 ? `bg-[#0D1140]` : `bg-green-600`
                  }`}
                >
                  {step.badge}
                </span>
              </div>

              {/* Right Column (Desktop only) */}
              <div className="hidden md:flex md:w-1/2 px-4 md:pl-12 justify-start mt-6 md:mt-0">
                {step.side === "right" && (
                  <div
                    className={`bg-white rounded-[8px] shadow-md p-6 border-l-[10px] border-green-600 max-w-md`}
                  >
                    <h3 className="text-lg font-bold text-[#002647]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {step.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Result Element - Either Text or Link */}
      <div className="flex justify-center">
        {resultText && (
          <p className="text-lg text-gray-700 text-left md:text-center px-4 py-2 rounded bg-gray-200">
            {resultText}
          </p>
        )}
        {resultLink && (
          <Link
            href={resultLink.href}
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            {resultLink.text}
          </Link>
        )}
      </div>
    </main>
  );
}
