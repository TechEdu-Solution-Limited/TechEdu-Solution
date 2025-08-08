"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import Link from "next/link";

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

const team: TeamMember[] = [
  {
    name: "John S. Sergent",
    role: "Head of Data Science",
    image: "/team/developer.avif",
  },
  {
    name: "Precious Akaighe",
    role: "Founder & Principal Consultant",
    image: "/team/Precious-The-Founder.png",
  },
  {
    name: "Dr. Godbless Akaighe",
    role: "Leadership & Scholarship Coach",
    image: "/team/Dr-Godbless-Akaighe.png",
  },
  {
    name: "David A. Sequiros",
    role: "Engineering Architect",
    image: "/team/developer.avif",
  },
  {
    name: "Emily R. Chau",
    role: "UX Design Mentor",
    image: "/team/researcher.webp",
  },
  {
    name: "Liam O. Walker",
    role: "Backend Systems Lead",
    image: "/team/developer.avif",
  },
];

const VISIBLE_CARDS = 4;

const InstructorCarousel = () => {
  const swiperRef = useRef<SwiperCore>();
  const [index, setIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleDotClick = (i: number) => {
    swiperRef.current?.slideTo(i);
  };

  const handleSlideChange = (swiper: SwiperCore) => {
    setIndex(swiper.activeIndex);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <section aria-labelledby="meet-the-team" className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2
          id="meet-the-team"
          className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center mb-8"
        >
          Meet the Team
        </h2>

        <p className="mb-6 text-gray-700">We're a hybrid team of:</p>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16" role="list">
          {[
            "PhD researchers and scholarship experts",
            "Certified career coaches and HR analysts",
            "Data scientists, instructional designers, and tech founders",
          ].map((text, i) => (
            <li
              key={i}
              className="bg-gray-100 rounded-[8px] flex items-center gap-4"
            >
              <IoMdCheckmark
                size={70}
                className="p-4 rounded-[8px] bg-gray-500 text-white"
              />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <div className="relative w-full px-4 py-4">
          {/* Custom Arrows */}
          {!isBeginning && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
              aria-label="Previous"
            >
              <FaChevronLeft size={20} />
            </button>
          )}

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={handleSlideChange}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 30 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: VISIBLE_CARDS, spaceBetween: 40 },
            }}
            className="team-swiper"
          >
            {team.map((member, index) => (
              <SwiperSlide key={index}>
                <div className="text-center rounded-[10px] p-4 bg-white">
                  <div className="w-full h-[14rem] relative overflow-hidden rounded-[8px]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-800">
                    {member.name.split(" ")[0]} <br />
                    {member.name.split(" ").slice(1).join(" ")}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="py-8 flex flex-col items-center">
            <p className="text-center text-xl font-semibold pb-4">
              Want to collaborate or work with us?
            </p>
            <Link
              href="#"
              className="px-12 py-3 rounded-[10px] bg-[#0D1140] hover:bg-blue-700 text-white"
            >
              View Career
            </Link>
          </div>

          {!isEnd && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
              aria-label="Next"
            >
              <FaChevronRight size={20} />
            </button>
          )}

          {/* Custom Dot Indicators */}
          <div className="flex justify-start gap-2 mt-6 ml-2">
            {Array.from({ length: team.length }).map((_, dotIndex) => (
              <div
                key={dotIndex}
                onClick={() => handleDotClick(dotIndex)}
                className={`h-2 rounded-sm cursor-pointer transition-all ${
                  index === dotIndex ? "w-10 bg-[#00B2FF]" : "w-2 bg-[#0074e4]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorCarousel;
