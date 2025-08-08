"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

const slides = [
  {
    name: "Amina O.",
    profession: "Ph.D Student",
    image: "/assets/graduant.webp",
    review:
      "The coaching I received helped me win a DAAD scholarship to Germany. The proposal template alone was gold.",
  },
  {
    name: "Ngozi B.",
    profession: "HR Director, UK",
    image: "/assets/graduant.webp",
    review:
      "We hired two analysts and one intern through CareerConnect in under a week.",
  },
  {
    name: "Dr. Susan",
    profession: "Dean of Research",
    image: "/assets/researcher.webp",
    review:
      "It's rare to find a platform that blends academic, career, and business clarity this well.",
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

export default function PeopleStories() {
  const [mounted, setMounted] = useState(false);
  const [[current, direction], setCurrent] = useState([0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!mounted) return;
    startAutoplay();
    return stopAutoplay;
  }, [mounted]);

  const stopAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <section
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
      className="py-8 md:py-16 px-4 md:px-16 mx-auto bg-white md:h-full"
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

      <div className="relative h-[450px] md:h-auto overflow-hidden">
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
            className="absolute inset-0 flex flex-col md:flex-row items-center gap-10 md:gap-20"
          >
            {/* Image */}
            <div className="relative w-full md:w-1/2 max-w-sm md:max-w-md h-[200px] md:h-[400px]">
              <div className="absolute left-0 top-0 w-6 h-full rounded-[12px] shadow-md bg-[#0047FF] z-0" />
              <div className="relative w-full h-full z-10 rounded-[12px] overflow-hidden">
                <Image
                  src={slides[current].image}
                  alt={slides[current].name}
                  fill
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
                  {slides[current].profession}
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
      <div className="flex items-center justify-end gap-2">
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
