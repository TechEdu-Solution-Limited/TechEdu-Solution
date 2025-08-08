"use client";

import { HelpCircle, Minus, Plus } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  title: string;
  faqs: FAQItem[];
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  panelClassName?: string;
}

export default function FAQAccordion({
  title,
  faqs,
  className = "",
  buttonClassName = "",
  iconClassName = "",
  panelClassName = "",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className={`py-10 md:py-16 px-4 sm:px-8 ${className}`}
    >
      <h2
        id="faq-heading"
        className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
      >
        {title}
      </h2>

      <div className="max-w-2xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={faq.id}>
            <button
              type="button"
              onClick={() => toggleAccordion(index)}
              className={`w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 rounded-md shadow-sm transition-all duration-300 ease-in-out
                ${openIndex === index ? "bg-gray-200" : buttonClassName}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600`}
              aria-expanded={Boolean(openIndex === index)}
              aria-controls={`accordion-panel-${faq.id}`}
              id={`accordion-header-${faq.id}`}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${iconClassName}`}
                >
                  <HelpCircle size={20} />
                </span>
                <span className="font-bold">Q:</span>
                {faq.question}
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300"
              >
                {openIndex === index ? <Minus /> : <Plus /> }
              </span>
            </button>

            <div
              id={`accordion-panel-${faq.id}`}
              role="region"
              aria-labelledby={`accordion-header-${faq.id}`}
              className={`px-6 pb-4 mt-1 text-gray-700 rounded-md transition-all duration-300 ease-in-out overflow-hidden ${panelClassName}
                ${
                  openIndex === index
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
            >
              <p className="mt-2 text-sm">
                <span className="font-bold">A:{" "}</span>
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
