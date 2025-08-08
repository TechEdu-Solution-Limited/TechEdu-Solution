import { Check } from "lucide-react";
import Link from "next/link";

export default function PartnerHiringInquiries() {
  return (
    <section className="bg-white py-16 flex justify-center items-center">
      <div className="bg-[#0D1140] text-white py-8 rounded-xl relative overflow-hidden px-4 sm:px-12 lg:px-16 w-[90%] md:w-[80%]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Partnership & Hiring Inquiries
          </h2>
          <p className="text-blue-100 mb-8">Looking to:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              "Hire through CareerConnect?",
              "Onboard your team into a training program?",
              "Build a custom institutional partnership?",
            ].map((text, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-blue-100 text-blue-900 rounded-[8px] shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-200 group"
              >
                <div className="bg-blue-600 text-white p-4 rounded-[8px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <Check
                    size={30}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <p className="text-sm font-medium leading-5">{text}</p>
              </div>
            ))}
          </div>

          <p className="text-[1rem] text-blue-100 mt-8">
            <strong className="font-semibold">Please reach us at:</strong>{" "}
            <Link
              href="mailto:partnerships@techedusolution.com"
              className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 hover:underline"
            >
              partnerships@techedusolution.com
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
