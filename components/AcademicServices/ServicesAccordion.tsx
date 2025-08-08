"use client";

import { useState } from "react";
import React from "react";
import { LucideIcon, Minus, PlusIcon } from "lucide-react";
import Link from "next/link";

export interface ServiceItem {
  id: number;
  title: string;
  icon?: LucideIcon;
  description?: string;
  details?: string[];
  cta?: {
    label: string;
    href: string;
  };
  question?: string;
  answer?: string;
}

interface ServicesAccordionProps {
  title: string;
  services?: ServiceItem[];
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  panelClassName?: string;
  question?: string;
  answer?: string;
}

export default function ServicesAccordion({
  title,
  services,
  className = "bg-gray-50",
  buttonClassName = "bg-white hover:bg-gray-100",
  iconClassName = "text-blue-500",
  panelClassName = "bg-gray-100",
}: ServicesAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      aria-labelledby="services-heading"
      className={`py-10 md:py-16 px-4 sm:px-8 ${className}`}
    >
      <h2
        id="services-heading"
        className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
      >
        {title}
      </h2>

      <div className="max-w-2xl mx-auto">
        {(services ?? []).map((service, index) => (
          <div key={service.id}>
            <button
              type="button"
              onClick={() => toggleAccordion(index)}
              className={`w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 rounded-md shadow-sm transition-all duration-300 ease-in-out
                ${openIndex === index ? "bg-gray-200" : buttonClassName}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600`}
              aria-expanded={Boolean(openIndex === index)}
              aria-controls={`accordion-panel-${service.id}`}
              id={`accordion-header-${service.id}`}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${iconClassName}`}
                >
                  {service.icon && React.createElement(service.icon)}
                </span>
                {service.title}
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300"
              >
                {openIndex === index ? (
                  <Minus size={18} className="font-bold" />
                ) : (
                  <PlusIcon size={18} className="font-bold" />
                )}
              </span>
            </button>

            <div
              id={`accordion-panel-${service.id}`}
              role="region"
              aria-labelledby={`accordion-header-${service.id}`}
              className={`px-6 pb-4 mt-1 text-gray-700 rounded-md transition-all duration-300 ease-in-out overflow-hidden ${panelClassName}
                ${
                  openIndex === index
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
            >
              <p className="mt-2 text-sm">{service.description}</p>
              <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
                {service.details?.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <div className="mt-4">
                {service.cta && (
                  <Link
                    href={service.cta.href}
                    className="inline-block bg-blue-500 hover:text-blue-400 text-white text-sm px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                  >
                    {service.cta.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
