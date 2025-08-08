"use client";
import HowItWorks from "@/components/HomePage/HowItWorks";

const stats = [
  { label: "Students Mentored", value: "1k+" },
  { label: "Thesis Completion Rate", value: "94%" },
  { label: "Scholarship Success Rate", value: "87%" },
  { label: "Countries Served", value: "10+" },
];

const academicSteps = [
  {
    id: 1,
    title: "Book a Free Call",
    description: "Share your challenge, get matched with a mentor",
    badge: "1",
    side: "left" as const,
  },
  {
    id: 2,
    title: "Pick Your Track",
    description: "Thesis support, editing, or scholarship prep",
    badge: "2",
    side: "right" as const,
  },
  {
    id: 3,
    title: "Start Moving Forward",
    description: "We guide, you grow",
    badge: "3",
    side: "left" as const,
  },
];

export default function HowAcademicWorks() {
  return (
    <section aria-labelledby="how-it-works" className="bg-white text-gray-900">
      {/* STATS */}
      <div className="bg-gray-200 py-10">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-8 px-4 text-center">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center w-[calc(50%-2rem)] sm:w-[calc(33.333%-2rem)] md:w-[calc(25%-2rem)]"
            >
              <p className="text-4xl font-extrabold text-gray-700">
                {stat.value}
              </p>
              <p className="text-[14px] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <HowItWorks
        title="How It Works"
        steps={academicSteps}
        resultLink={{
          text: "Book a Free Discovery Call",
          href: "/contact#discovery-call",
        }}
        primaryColor="green-600"
        secondaryColor="[#011F72]"
        className="bg-white"
      />
    </section>
  );
}
