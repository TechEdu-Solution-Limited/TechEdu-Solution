import Link from "next/link";

export default function ExploreMore() {
  return (
    <section
      aria-labelledby="explore-more"
      className="py-20 px-8 md:px-16 mx-auto bg-gray-50 text-center"
    >
      <h2
        id="explore-more"
        className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12"
      >
        Explore More
      </h2>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {[
          { text: "All Services", urlpath: "/career-connect" },
          { text: "Start with a Tool", urlpath: "/tools/cv-builder" },
          { text: "Partner with Us", urlpath: "#" },
          { text: "Contact the Team", urlpath: "/contact" },
        ].map((text, idx) => (
          <Link
            key={idx}
            href={text.urlpath}
            className="bg-gray-200 hover:bg-gray-300 text-[#011F72] font-semibold shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 rounded-[10px] transition-all duration-200 ease-in-out hover:tracking-wider"
            aria-label={text.text}
          >
            {text.text} →
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center px-4 md:px-16 mx-auto">
        <div className="text-left">
          <h3 className="text-2xl font-bold mb-2">Ready to Work With Us?</h3>
          <p className="text-gray-700 mb-10">
            Whether you're applying for a scholarship, trying to scale your
            career, or building a better business—
            <strong className="font-semibold"> we've got your back.</strong>
          </p>
        </div>
        <div className="flex justify-start md:justify-end">
          <Link
            href="/contact"
            className="inline-block text-center bg-gray-200 text-[#011F72] font-semibold px-6 py-3 rounded-[10px] shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 hover:bg-gray-300 transition"
          >
            Book a Free Discovery Call
          </Link>
        </div>
      </div>
    </section>
  );
}
