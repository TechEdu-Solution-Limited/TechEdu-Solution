"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

const slides = [
  {
    name: "Emillie Jonas",
    country: "England",
    image: "/assets/graduant.webp",
    review:
      "EduTech Solutions is an ideal location for anybody who wants to learn something new or share what they know with others. EduTech Solutions is a worldwide platform for online learning that helps to connect with one another via knowledge. It comes highly recommended from my side.",
  },
  {
    name: "Chinedu Uzo",
    country: "UK",
    image: "/assets/graduant.webp",
    review:
      "Thanks to EduTech Solutions, I was able to land a remote internship in Germany while still studying in London. Their platform is incredibly supportive and makes learning fun and practical.",
  },
  {
    name: "Fatima Khalid",
    country: "UAE",
    image: "/assets/student-1.webp",
    review:
      "What makes EduTech Solutions stand out is the real-world relevance of the training. It's not just theory — it's mentorship, tools, and support. I've grown both professionally and personally.",
  },
];

const slideVariants: Variants = {
  initial: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute",
  }),
  animate: {
    x: "0%",
    opacity: 1,
    position: "relative",
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    position: "absolute",
    transition: { duration: 0.6, ease: "easeInOut" },
  }),
};

export default function StudentReview() {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrent(([prev]) => [(prev + 1) % slides.length, 1]);
    restartAutoplay();
  };

  const prevSlide = () => {
    setCurrent(([prev]) => [(prev - 1 + slides.length) % slides.length, -1]);
    restartAutoplay();
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(nextSlide, 4000);
  };

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, []);

  const stopAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <section
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
      className="py-16 px-4 md:px-16 mx-auto bg-white"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#002647]">
          <span className="uppercase text-outline text-white">
            Clients Stories
          </span>
        </h2>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            title="Previous Slide"
            onClick={prevSlide}
            className="p-2 bg-[#8094C5] rounded-full text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="submit"
            title="Next Slide"
            onClick={nextSlide}
            className="p-2 bg-[#8094C5] rounded-full text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative h-[520px] md:h-auto overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.x < -100) {
                nextSlide();
              } else if (info.offset.x > 100) {
                prevSlide();
              }
            }}
            className="absolute inset-0 flex flex-col md:flex-row items-center gap-10"
          >
            {/* Image */}
            <div className="relative w-full md:w-1/2 max-w-sm md:max-w-md h-[300px] md:h-[400px]">
              <div className="absolute left-0 top-0 w-6 h-full rounded-[12px] shadow-md bg-[#0047FF] z-0" />
              <div className="relative w-full h-full z-10 rounded-[12px] overflow-hidden">
                <Image
                  src={slides[current].image}
                  alt={slides[current].name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={current === 0}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div className="md:w-1/2 relative z-10">
              <div className="relative z-10">
                <div className="text-[#002647] font-semibold text-2xl relative z-10">
                  {slides[current].name}
                </div>
                <div className="text-gray-600 mb-6 relative z-10">
                  {slides[current].country}
                </div>
                <div className="text-[#4B5563] leading-relaxed relative z-10">
                  {slides[current].review}
                </div>
                <div className="absolute text-[10rem] text-[#EAF5FC]/50 top-0 left-16 -z-0 select-none pointer-events-none hidden md:block">
                  <Quote size={250} />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-end gap-2 mt-10">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent([i, i > current ? 1 : -1])}
            className={clsx(
              "h-2 rounded-sm cursor-pointer transition-all duration-300",
              current === i ? "w-12 bg-[#00B2FF]" : "w-2 bg-[#0074e4]"
            )}
          />
        ))}
      </div>
    </section>
  );
}
