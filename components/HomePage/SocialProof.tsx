import Image from "next/image";

// components/SocialProof.tsx
const logos = [
  {
    institute: "University of Ibadan",
    img: "/assets/TechEdu-Solution-Logo.webp",
  },
  {
    institute: "EduBridge Global Network",
    img: "/assets/TechEdu-Solution-Logo.webp",
  },
  { institute: "TopRecruit Africa", img: "/assets/TechEdu-Solution-Logo.webp" },
  {
    institute: "500+ Scholars & Professionals Worldwide",
    img: "/assets/TechEdu-Solution-Logo.webp",
  },
];

export default function SocialProof() {
  return (
    <section
      aria-labelledby="social-proof-heading"
      className="py-20 px-4 md:px-16 mx-auto bg-gray-50"
    >
      <h2
        id="social-proof-heading"
        className="text-3xl md:text-5xl font-extrabold text-[#002647] mb-4"
      >
        <span className="uppercase text-outline text-white">
          Social Proof & Credibility
        </span>
      </h2>

      <div className="mb-8">
        <p className="font-semibold text-gray-800 mb-4">As Trusted By:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {logos.map((label, index) => (
            <div
              key={`trusted-${index}`}
              className="bg-blue-50 flex flex-col items-center justify-center px-4 py-8 rounded-[8px]"
              role="img"
              aria-label={`Logo of ${label}`}
            >
              <div className="bg-gray-300 w-20 h-20 mb-2 rounded-md">
                <Image
                  src={label.img}
                  alt={label.institute}
                  width={80}
                  height={80}
                  className="object-fit"
                />
              </div>
              <p className="text-center text-sm text-gray-800">
                {label.institute}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold text-gray-800 mb-4">As Featured In:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {logos.map((label, index) => (
            <div
              key={`trusted-${index}`}
              className="bg-blue-50 flex flex-col items-center justify-center px-4 py-8 rounded-[8px]"
              role="img"
              aria-label={`Logo of ${label}`}
            >
              <div className="bg-gray-300 w-16 h-16 mb-2 rounded-md">
                <Image
                  src={label.img}
                  alt={label.institute}
                  width={80}
                  height={80}
                  className="object-fit"
                />
              </div>
              <p className="text-center text-sm text-gray-800">
                {label.institute}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
