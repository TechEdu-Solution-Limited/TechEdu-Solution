"use client";

import Image from "next/image";

export default function NewsletterFooter() {
  return (
    <div className=" bg-[#E0F6FF]">
      {/* Newsletter Section */}
      <section className="md:max-w-[50vw] mx-auto px-4 py-28 flex flex-col lg:flex-row items-center gap-8">
        <div className="w-full lg:w-1/2">
          <Image
            src="/assets/newsletter.png"
            alt="Newsletter"
            width={500}
            height={400}
            className="w-full h-auto"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl font-normal text-[#003294] mb-6">
            Get Regular Updates from
          </h2>
          <Image
            src="/assets/techedusolution.jpg"
            alt="Logo"
            width={170}
            height={170}
          />

          <h2 className="text-xl font-normal uppercase text-[#003294] mt-4">
            Subscribe to our Newsletter
          </h2>
          <p className="mb-6 text-gray-600">
            Stay updated with our latest services, tips, and news. Enter your
            email to subscribe.
          </p>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-[#0D1140] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
