"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { FaQuoteRight } from "react-icons/fa";

export interface Story {
  name: string;
  country?: string;
  image: string;
  review: string;
  role?: string;
}

interface StoryCarouselProps {
  stories: Story[];
  title: string;
  paragraph?: string;
  className?: string;
  autoPlayInterval?: number;
}

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

export default function StoryCarousel({
  stories,
  title,
  paragraph,
  className = "",
  autoPlayInterval = 4000,
}: StoryCarouselProps) {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrent(([prev]) => [(prev + 1) % stories.length, 1]);
    restartAutoplay();
  };

  const prevSlide = () => {
    setCurrent(([prev]) => [(prev - 1 + stories.length) % stories.length, -1]);
    restartAutoplay();
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(nextSlide, autoPlayInterval);
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
      className={`py-8 md:py-16 px-4 md:px-16 mx-auto bg-white  ${className}`}
    >
      <div className="flex justify-between items-center mt-6 mb-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white">
            {title}
          </h2>
          <p className="text-md text-black my-4">{paragraph}</p>
        </div>

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

      <div className="relative md:h-[450px] h-auto overflow-hidden">
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
            <div className="relative w-full md:w-1/2 max-w-sm md:max-w-[24rem] h-[200px] md:h-[350px]">
              <div className="absolute left-0 top-0 w-6 h-full rounded-[12px] shadow-md bg-[#0047FF] z-0" />
              <div className="relative w-full h-full z-10 rounded-[12px] overflow-hidden">
                <Image
                  src={stories[current].image}
                  alt={stories[current].name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div className="md:w-1/2 relative z-10">
              <div className="relative z-10">
                <div className="text-[#002647] font-semibold text-2xl relative z-10">
                  {stories[current].name}
                </div>
                <div className="text-[#002647] font-normal text-lg relative z-10">
                  {stories[current].role}
                </div>
                <div className="text-gray-600 mb-6 relative z-10">
                  {stories[current].country}
                </div>
                <div className="text-[#4B5563] leading-relaxed relative z-10">
                  {stories[current].review}
                </div>
                <div className="absolute text-[10rem] text-[#EAF5FC]/50 top-0 left-16 -z-0 select-none pointer-events-none hidden md:block">
                  <FaQuoteRight size={250} />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-end gap-2 md:-mt-12">
        {stories.map((_, i) => (
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
