"use client";

import Link from "next/link";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const navigationItems = [
  { label: "Book a Discovery Call", href: "/book-call" },
  { label: "Try Our Tools", href: "/tools" },
  { label: "View Our Services", href: "/services" },
  { label: "About the Company", href: "/about" },
];

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export default function QuickNavigationLinks() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDateChange = (value: any) => {
    setSelectedDate(value as Date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      // Here you would typically integrate with your booking system
      console.log(
        `Booking for ${selectedDate.toDateString()} at ${selectedTime}`
      );
      setShowConfirmation(true);
      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        // Reset selections
        setSelectedDate(null);
        setSelectedTime(null);
      }, 3000);
    }
  };

  return (
    <section className="bg-gray-100 text-gray-900 py-16 px-4 md:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12">
          Quick Navigation Links
        </h2>

        <nav aria-label="Quick navigation links">
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10"
            role="list"
          >
            {navigationItems.map((item, i) => (
              <li key={i} role="listitem">
                <Link
                  href={item.href}
                  className="block w-full bg-gray-300 text-sm text-[#011F72] font-semibold py-3 px-4 rounded-[10px] hover:shadow-md hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#011F72] focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div id="discovery-call" className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl text-[#011F72] font-bold mb-2">
            Ready to unlock clarity?
          </h3>
          <p className="text-sm md:text-base mb-4">
            Let's map out your next move—whether you need academic support,
            career strategy, or a training package.
          </p>
          <p className="font-semibold text-sm md:text-base mb-6">
            Book a free 15–30 minute discovery call with a member of our expert
            team.
          </p>
          <div className="bg-white rounded-[10px] shadow-sm p-4 mb-6">
            <p className="text-gray-600 text-sm mb-4">
              Use the calendar below to choose a time that works for you.
            </p>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
              <div className="w-full md:w-auto">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()}
                  className="border-none rounded-[10px]"
                  tileClassName={({ date }) =>
                    date < new Date() ? "opacity-50 cursor-not-allowed" : ""
                  }
                />
              </div>
              {selectedDate && (
                <div className="w-full md:w-64">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Available Time Slots
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        type="submit"
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`p-2 text-sm rounded-[8px] transition-all duration-200 ${
                          selectedTime === time
                            ? "bg-[#0D1140] text-white"
                            : "bg-blue-50 text-[#011F72] hover:bg-blue-100"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedDate && selectedTime && (
              <div className="mt-6 relative">
                <button
                  type="submit"
                  onClick={handleBooking}
                  className="bg-[#0D1140] text-white px-6 py-2 rounded-[8px] hover:bg-blue-700 transition-colors duration-200"
                >
                  Confirm Booking
                </button>
                {showConfirmation && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-50 animate-fadeIn" />
                    <div className="relative bg-white p-8 rounded-[10px] shadow-lg animate-scaleIn">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                          <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Booking Confirmed!
                        </h3>
                        <p className="text-gray-600">
                          Your appointment has been scheduled successfully.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Add these styles to your global CSS file or create a new style block
const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
`;
