"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Slide = {
  id: number;
  title: string;
  description: string;
  path: string;
  image: string;
  buttonText: string;
};

type HeroCarouselProps = {
  slides: Slide[];
  heightClass?: string; // e.g., "h-96"
  interval?: number; // in ms, default is 5000
};

const colors = ["#074a71", "#f6b703", "#04959f", "#049774"];

const slideVariants: Variants = {
  initial: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    position: "absolute",
  }),
  animate: {
    x: "0%",
    position: "absolute",
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    position: "absolute",
    transition: { duration: 0.5, ease: "easeInOut" },
  }),
};

export default function HeroCarousel({
  slides,
  heightClass = "h-96",
  interval = 5000,
}: HeroCarouselProps) {
  const [[current, direction], setCurrent] = useState([0, 0]);

  const nextSlide = () => {
    setCurrent(([prev]) => [(prev + 1) % slides.length, 1]);
  };

  const prevSlide = () => {
    setCurrent(([prev]) => [(prev - 1 + slides.length) % slides.length, -1]);
  };

  useEffect(() => {
    const id = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(id);
  }, [current, interval]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto lg:pt-[8rem] pb-4">
      {/* Carousel Container */}
      <div
        className={clsx(
          "relative w-full rounded-xl overflow-hidden shadow-lg",
          heightClass
        )}
      >
        {/* Slide Number */}
        <div className="absolute top-4 right-4 text-[#00A4EF] bg-[#0D1140]/60 p-4 text-4xl font-bold z-30">
          {(current + 1).toString().padStart(2, "0")}
        </div>

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full relative"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.x < -100) nextSlide();
              else if (info.offset.x > 100) prevSlide();
            }}
          >
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 text-white px-6 py-8 flex flex-col justify-end">
              <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                {slides[current].title}
              </h3>
              <p className="text-base mb-4">{slides[current].description}</p>
              <Link
                href={slides[current].path}
                className="inline-block self-start border border-white text-white hover:bg-white hover:text-[#011F72] text-sm px-4 py-2 rounded-md font-medium transition"
              >
                {slides[current].buttonText} →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full mt-4">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={clsx(
                "h-2 rounded-sm bg-[#0074e4] transition-all duration-300",
                current === i ? "w-12 bg-[#00B2FF]" : "w-2"
              )}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={prevSlide}
            className="text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full"
            aria-label="Next Slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
