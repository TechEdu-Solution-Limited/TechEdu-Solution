import {
  BookOpenCheck,
  Briefcase,
  ChartBar,
  Flag,
  LucideIcon,
} from "lucide-react";
import React from "react";

type PlatformFeaturesItem = {
  icon: LucideIcon;
  title?: string;
  subtitle?: string;
  desc?: string;
};

const trainingPackages: PlatformFeaturesItem[] = [
  {
    icon: Briefcase,
    title: "Workplace Readiness",
    subtitle: "Corp interns & NYSC",
    desc: "CV, Comms, Time Management",
  },
  {
    icon: ChartBar,
    title: "Data & Tools Pro",
    subtitle: "SME teams",
    desc: "Excel, Dashboards, PowerPoint",
  },
  {
    icon: Flag,
    title: "Leadership Mastery",
    subtitle: "Middle Management",
    desc: "Strategy, Feedback Loops, Team Building",
  },
  {
    icon: BookOpenCheck,
    title: "Education Boost",
    subtitle: "Teachers, EduStaff",
    desc: "Zoom teaching, Digital Tools, Records Management",
  },
];

const colors = ["#074a71", "#f6b703", "#04959f", "#049774"];

const TraniningPackages = () => {
  return (
    <section className="py-20 px-4 md:px-16 bg-white">
      <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-12">
        Sample Training Packages
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {trainingPackages.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-gray-200 rounded-[10px] shadow-sm px-4 py-7 flex flex-col items-center"
            >
              <Icon
                size={60}
                className="text-black bg-white p-2 rounded-[16px] mb-3"
                style={{ color: colors[index] }}
              />
              <h3 className="text-[1.2rem] text-gray-800 text-center mb-2">
                {item.title}
              </h3>
              <h4 className="text-[1rem] text-black text-center mt-3 pt-2 border-t-2 border-t-gray-400 font-semibold w-full">
                {item.subtitle}
              </h4>
              <p className="text-sm text-gray-800 text-center">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TraniningPackages;
