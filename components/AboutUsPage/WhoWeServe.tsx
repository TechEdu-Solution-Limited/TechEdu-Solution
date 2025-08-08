// components/WhoWeServe.tsx
import { Briefcase, GraduationCap, Pencil } from "lucide-react";
import { MdCorporateFare } from "react-icons/md";

const WhoWeServe = () => {
  const services = [
    {
      icon: (
        <GraduationCap
          size={60}
          className="text-[#011F72]"
          aria-hidden="true"
        />
      ),
      title: "Postgraduate Students",
      desc: "Mentorship, proposal review, scholarship strategy",
    },
    {
      icon: <Pencil size={60} className="text-[#011F72]" aria-hidden="true" />,
      title: "Undergraduate Students",
      desc: "Mentorship, career planning, internship prep",
    },
    {
      icon: (
        <Briefcase size={60} className="text-[#011F72]" aria-hidden="true" />
      ),
      title: "Early-career Professionals",
      desc: "Resume review, job coaching, skill mapping",
    },
    {
      icon: (
        <MdCorporateFare
          size={60}
          className="text-[#011F72]"
          aria-hidden="true"
        />
      ),
      title: "Corporate Trainees",
      desc: "Team training, productivity coaching, upskilling",
    },
  ];

  return (
    <section
      className="py-20 px-4 md:px-16 mx-auto bg-[#0D1140]"
      aria-labelledby="who-we-serve"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          id="who-we-serve"
          className="text-3xl md:text-5xl font-extrabold uppercase gray-text-outline text-[#011F72] text-center pb-16"
        >
          Who We Serve
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-6 bg-blue-300 rounded-[10px] shadow-sm border border-blue-300"
            >
              <div className="bg-blue-100 p-2 rounded-md" aria-hidden="true">
                {item.icon}
              </div>
              <div>
                <h3 className="text-[1.4rem] font-bold text-[#011F72]">
                  {item.title}
                </h3>
                <p className="text-md text-gray-700 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeServe;
