import QuickNavigationLinks from "@/components/ContactUsPage/QuickNavigationLink";
import PartnerHiringInquiries from "@/components/ContactUsPage/PartnerHiringInquiries";
import ContactForm from "@/components/ContactUsPage/ContactForm";
import React from "react";

const page = () => {
  return (
    <>
      <header className="mx-auto px-4 md:px-16 pt-16 pb-16 flex flex-col items-center justify-center text-center bg-[#0D1140] w-full">
        <h1 className="text-5xl font-bold text-gray-200 pb-4 pt-20 leading-[4rem]">
          Empowering Growth Through <br />
          Expert-Led Learning and Career Innovation.
        </h1>
        <h2 className="text-lg font-medium text-white md:text-xl md:max-w-[65vw]">
          Whether you’re a student seeking mentorship, a jobseeker ready to
          stand out, or a business leader exploring smarter training—we’d love
          to hear from you.
        </h2>
        <h2 className="text-lg pt-8 font-medium text-white sm:text-xl">
          We typically respond within 1 business day.
        </h2>
      </header>
      <ContactForm />
      <PartnerHiringInquiries />
      <QuickNavigationLinks />
    </>
  );
};

export default page;
