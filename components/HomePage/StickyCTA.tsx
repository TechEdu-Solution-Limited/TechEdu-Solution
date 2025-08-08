"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdKeyboardDoubleArrowRight, MdRocketLaunch } from "react-icons/md";
import { TbBrandBooking } from "react-icons/tb";
import { disableHeaderWithFooter } from "@/utils/disableHeaderWithFooter";
import { usePathname } from "next/navigation";

const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const shouldHideHeader = disableHeaderWithFooter.some((path) => {
    const pattern = path.replace(/\[.*\]/g, "[^/]+");
    return new RegExp(`^${pattern}$`).test(pathname);
  });

  if (!isVisible || shouldHideHeader) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isMobile ? "bottom-12 right-3" : "bottom-6 right-6"
      }`}
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
    >
      <div className="relative">
        {/* CTA Expansion Wrapper */}
        <Link
          href="/contact#discovery-call"
          onClick={() => isMobile && setIsExpanded(false)}
          className={`flex items-center bg-amber-600 text-white shadow-lg rounded-full transition-all duration-300 ease-in-out overflow-hidden 
            ${isExpanded || isMobile ? "w-64 px-5" : "w-12 px-3"} py-3`}
          onTouchStart={() => isMobile && setIsExpanded((prev) => !prev)}
        >
          <TbBrandBooking size={25} className="min-w-[20px] mr-2" />
          <span
            className={`transition-opacity duration-300 ${
              isExpanded || isMobile ? "opacity-100 ml-2" : "opacity-0 ml-0"
            } whitespace-nowrap`}
          >
            Book a Free Discovery Call
          </span>
          {(isExpanded || isMobile) && (
            <MdKeyboardDoubleArrowRight size={20} className="ml-auto" />
          )}
        </Link>
      </div>
    </div>
  );
};

export default StickyCTA;
