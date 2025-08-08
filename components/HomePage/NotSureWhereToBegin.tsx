import Link from "next/link";

// components/NotSureWhereToBegin.tsx
export default function NotSureWhereToBegin() {
  return (
    <section
      aria-labelledby="not-sure-heading"
      className="grid md:grid-cols-2 gap-6 items-center px-4 py-20 md:px-16 mx-auto bg-white"
    >
      <div>
        <h2
          id="not-sure-heading"
          className="text-3xl md:text-5xl font-extrabold text-[#002647] mb-4"
        >
          <span className="uppercase text-outline text-white">
            Not Sure Where To Begin?
          </span>
        </h2>
        <p className="font-semibold text-gray-600 mb-3">
          Let’s Find the Right Path—Together.
        </p>
        <p className="text-gray-800">
          Whether it's funding, a better job, or smarter strategy—our expert
          team will help you take the next confident step.
        </p>
      </div>
      <div className="flex justify-start md:justify-end">
        <Link
          href="/contact#discover-call"
          className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
        >
          Book a Free Discovery Call
        </Link>
      </div>
    </section>
  );
}
