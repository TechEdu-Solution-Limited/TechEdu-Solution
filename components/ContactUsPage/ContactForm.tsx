"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "@/lib/emailjs-config";

export default function ContactForm() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreed) {
      setSubmitStatus("error");
      setSubmitMessage("Please agree to the data policy before submitting.");
      return;
    }

    setLoading(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      // Add submission date to form data
      const formData = new FormData(formRef.current!);
      formData.append(
        "submit_date",
        new Date().toLocaleString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/London",
        })
      );

      // Use EmailJS configuration
      const result = await emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID!,
        EMAILJS_CONFIG.TEMPLATE_ID!,
        formRef.current!,
        EMAILJS_CONFIG.PUBLIC_KEY!
      );

      if (result.status === 200) {
        setSubmitStatus("success");
        setSubmitMessage(
          "Message sent successfully! We'll get back to you soon."
        );

        // Reset form
        if (formRef.current) {
          formRef.current.reset();
          setAgreed(false);
        }
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        "Failed to send message. Please try again or contact us directly."
      );
    } finally {
      setLoading(false);
    }
  };

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
                    href="mailto:info@techedusolution.com"
                    className="text-[1rem] text-black font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  >
                    info@techedusolution.com
                  </Link>
                </li>
                <li className="flex items-center gap-4 sm:gap-6">
                  <FaPhone size={28} className="text-gray-700 flex-shrink-0" />
                  <Link
                    href="tel:+442071234567"
                    className="text-[1rem] text-black font-medium hover:text-gray-900 hover:font-bold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    +44 78 4882 9768
                  </Link>
                </li>
                <li className="flex items-center gap-4 sm:gap-6">
                  <FaWhatsapp
                    size={28}
                    className="text-green-600 flex-shrink-0"
                  />
                  <Link
                    href="https://wa.me/447848829768"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[1rem] text-black font-medium hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  >
                    +44 78 4882 9768
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
            aria-label="Contact form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
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
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
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
                  name="user_phone"
                  placeholder="+44 78 4882 9768"
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
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
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
                I'm Reaching Out As... *
              </label>
              <select
                id="role"
                name="user_role"
                required
                className="mt-1 block w-full rounded-[8px] bg-gray-200 border border-gray-300 p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="individual">Individual Tech Professional</option>
                <option value="team">Team Tech Professional</option>
                <option value="institution">Institution</option>
                <option value="recruiter">Recruiter</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message *
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
                name="user_file"
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
                I agree to TechEdu Solution's data policy *
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreed}
              className={`w-full px-6 py-4 text-white font-semibold rounded-[8px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                loading || !agreed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0D1140] hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Message...
                </div>
              ) : (
                "Send Message →"
              )}
            </button>
            {/* Submit Status Messages */}
            {submitStatus === "success" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">{submitMessage}</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 font-medium">{submitMessage}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
