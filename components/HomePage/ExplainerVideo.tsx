import Link from "next/link";

// components/ExplainerVideo.tsx
export default function ExplainerVideo() {
  return (
    <section
      aria-labelledby="explainer-heading"
      className="py-16 px-4 md:px-16 mx-auto bg-blue-700"
    >
      <h2
        id="short-explainer-video-heading"
        className="uppercase gray-text-outline text-[#011F72] text-3xl md:text-5xl font-extrabold mb-10"
      >
        Short Explainer Video
      </h2>

      <div className="flex justify-center mb-4">
        <div className="aspect-video w-full md:max-w-[60vw] md:h-[350px] rounded-[12px] overflow-hidden flex items-center justify-center">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/BPcDx2767nU?si=8gN4fk4yvX7KAB66"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            title="TechEduk Explainer Video"
            frameBorder="0"
            // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:px-20 md:justify-between gap-4">
        <p className="text-white text-base">
          Your Growth Starts Here – 60 Seconds with TechEdu Solution.
        </p>
        <Link
          href="/how-it-works"
          className="inline-block self-start bg-[#0D1140] hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition"
        >
          See How It Works →
        </Link>
      </div>
    </section>
  );
}
