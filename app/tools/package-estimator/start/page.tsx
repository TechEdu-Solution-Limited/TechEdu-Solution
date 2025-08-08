"use client";

import { StepOne } from "@/components/EstimatorStepOne";
import { StepThree } from "@/components/EstimatorStepThree";
import { StepTwo } from "@/components/EstimatorStepTwo";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaCheckCircle, FaWrench, FaCashRegister } from "react-icons/fa";

const steps = [
  { id: 1, title: "What Are You Trying to Achieve?", icon: FaCheckCircle },
  { id: 2, title: "What Services Do You Need?", icon: FaWrench },
  { id: 3, title: "Review Your Estimate", icon: FaCashRegister },
];

export default function PackageEstimatorPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const goToNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const goToPrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne selected={selectedGoals} onChange={setSelectedGoals} />;
      case 2:
        return (
          <StepTwo selected={selectedServices} onChange={setSelectedServices} />
        );
      case 3:
        return <StepThree selectedServices={selectedServices} />;
      default:
        return null;
    }
  };

  const StepIcon = steps[currentStep - 1].icon;

  return (
    <>
      <header className="relative w-full px-4 pt-20 md:pt-20 md:px-16 min-h-[100vh]">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full xl:h-[80vh] z-0 bg-gradient-to-b from-[#011F72] to-[#ffffff] xl:bg-none xl:bg-[#0D1140]"></div>
        {/* Foreground Content */}
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-24 z-10 pt-16">
          {/* Left: Hero Content */}
          <div className="space-y-6 text-center md:pt-[7rem] xl:text-left xl:pt-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight xl:w-[63vw] text-white">
              Let’s Build Your Custom Support Package
            </h1>
            <p className="text-md md:text-[1.2rem] md:leading-8  text-white md:text-blue-300 max-w-2xl lg:max-w-xl mx-auto xl:mx-0 md:pt-6 md:pb-12">
              Answer a few quick questions and get an instant estimate for the
              exact tools, services, and support you need — whether you're
              applying for a scholarship, launching a career, or upskilling.
            </p>
            <div className="xl:pt-2">
              <Link
                href="#estimator-wizard-steps"
                className="bg-[#0D1140] hover:bg-blue-700 text-white text-center px-6 py-4 rounded text-[1rem] font-medium transition "
              >
                Begin Estimate → Scroll to Step 1
              </Link>
            </div>
          </div>

          {/* Right Video */}
          <div className="flex flex-col items-center w-full max-w-xl mx-auto xl:pt-[5rem] pb-4">
            {/* Video Container */}
            <div className="relative w-full rounded-xl overflow-hidden h-[16rem] md:h-[22rem]">
              <Image
                src="/icons/undraw_interview_yz52.svg"
                alt=""
                className="w-full h-full"
                height={250}
                width={300}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Estimator Wizard */}
      <section className="bg-white py-16" id="estimator-wizard-steps">
        <div className="max-w-4xl mx-auto p-4">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12">
            Estimator Wizard Steps
          </h2>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8 gap-4 md:gap-6">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold border-2 ${
                      isActive
                        ? "bg-[#0D1140] text-white border-[#011F72]"
                        : "bg-white text-gray-600 border-gray-300"
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium ${
                      isActive ? "text-[#011F72]" : "text-gray-500"
                    }`}
                  >
                    Step {step.id}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border rounded-[10px] bg-white shadow-md">
            <header className="flex items-center gap-3 px-6 py-4 border-b bg-gray-100">
              <StepIcon className="text-[#011F72]" />
              <h3 className="text-lg font-semibold">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h3>
            </header>

            <div className="p-6">{renderStepComponent()}</div>

            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
              <button
                onClick={goToPrev}
                disabled={currentStep === 1}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium disabled:opacity-50"
              >
                Previous
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={goToNext}
                  className="px-4 py-2 rounded bg-[#0D1140] hover:bg-blue-700 text-white text-sm font-medium"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="explore-more"
        className="py-20 px-4 md:px-16 bg-gray-100"
      >
        <div className=" max-w-6xl mx-auto flex flex-col items-center">
          <h2
            id="explore-more"
            className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white pb-8"
          >
            Not Ready Yet?
          </h2>
          {[
            {
              text: "Save My Estimate → Email to Myself",
              href: "/contact",
            },
            {
              text: "Share With My Coach / Employer",
              href: "/contact",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center bg-gray-200 hover:bg-gray-300 shadow-md text-[#011F72] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#011F72] px-6 py-3 mt-4 rounded-[10px] transition-all duration-200 ease-in-out hover:tracking-wider text-center w-full md:max-w-[500px]"
              aria-label={item.text}
            >
              {item.text}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
