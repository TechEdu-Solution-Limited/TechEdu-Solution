"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";

export default function ContactForm() {
  const [agreed, setAgreed] = useState(false);

  return (
    <section id="contact-form" className="bg-white">
      <div className="md:max-w-6xl mx-auto md:px-16 px-4 py-12 bg-white">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12">
          Contact Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Alternative Contact Info */}
          <div className="space-y-6 text-left">
            <div
              className="w-[400px] h-[350px] bg-white rounded-[8px] flex items-center justify-center"
              aria-hidden="true"
            >
              {/* Fixed image container with proper alignment */}
              <Image
                src="/assets/customer-support.png" // Replace with your image path
                alt="Alternative contact visual"
                width={400}
                height={450}
                className="object-contain"
              />
            </div>

            <div className="px-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Alternative Contact Info
              </h3>
              <p className="text-sm text-gray-600">
                You can also reach us directly:
              </p>

              <ul className="mt-6 space-y-3 md:space-y-4 text-[14px]">
                <li className="flex items-center gap-4 sm:gap-6">
                  <IoLocation
                    size={28}
                    className="text-[#011F72] flex-shrink-0"
                  />
                  <span className="text-[1rem] text-black font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out">
                    3 Cavendish Court, S Parade <br />
                    DN11 2DJ, Doncaster
                  </span>
                </li>
                <li className="flex items-center gap-4 sm:gap-6">
                  <MdEmail size={28} className="text-[#011F72] flex-shrink-0" />
                  <Link
                    href="mailto:contact@techedusolution.com"
                    className="text-[1rem] text-black font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  >
                    contact@techedusolution.com
                  </Link>
                </li>
                <li className="flex items-center gap-4 sm:gap-6">
                  <FaPhone size={28} className="text-gray-700 flex-shrink-0" />
                  <Link
                    href="tel:+442071234567"
                    className="text-[1rem] text-black font-medium hover:text-gray-900 hover:font-bold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    +44 20 7123 4567
                  </Link>
                </li>
                <li className="flex items-center gap-4 sm:gap-6">
                  <FaWhatsapp
                    size={28}
                    className="text-green-600 flex-shrink-0"
                  />
                  <Link
                    href="https://wa.me/442071234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[1rem] text-black font-medium hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  >
                    +44 20 7123 4567
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-6" aria-label="Contact form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="mt-1 block w-full rounded-[8px] bg-gray-200 border border-gray-300 p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="your.email@example.com"
                  className="mt-1 block w-full rounded-[8px] bg-gray-200 border border-gray-300 p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+44 20 7123 4567"
                  pattern="[0-9\s+()-]*"
                  title="Please enter a valid UK phone number"
                  className="mt-1 block w-full rounded-[8px] bg-gray-200 border border-gray-300 p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What is this regarding?"
                  maxLength={100}
                  className="mt-1 block w-full rounded-[8px] bg-gray-200 border border-gray-300 p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                I'm Reaching Out As...
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full rounded-[8px] bg-gray-200 border border-gray-300 p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="school">School</option>
                <option value="company">Company</option>
                <option value="investor">Investor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Please describe your inquiry in detail..."
                maxLength={1000}
                className="mt-1 block w-full rounded-[8px] bg-gray-200 border border-gray-300 p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                Maximum 1000 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700"
              >
                Attach File (Optional)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                className="mt-1 block w-full text-sm text-gray-700 bg-gray-200 file:border file:border-gray-300 file:rounded file:px-4 file:py-2 file:bg-gray-50 hover:file:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 5MB)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="h-4 w-4 text-[#011F72] focus:ring-blue-500 border-gray-300 rounded"
                aria-describedby="agree-description"
                required
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I agree to TechEdu Solution's data policy
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 text-white font-semibold bg-[#0D1140] hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[8px]"
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
