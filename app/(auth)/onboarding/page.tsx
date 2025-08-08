"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useRole } from "@/contexts/RoleContext";
import { UserRole } from "@/lib/dashboardData";
import AuthGuard from "@/components/AuthGuard";

const roles = [
  {
    title: "Student",
    role: "student" as UserRole,
    description:
      "I'm a student or currently in school\nAccess academic support, scholarship guidance, and mentorship.",
    icon: "/icons/undraw_teacher_s628.svg",
  },
  // {
  //   title: "Graduate / Jobseeker",
  //   role: "graduate" as UserRole,
  //   description:
  //     "I've graduated and I'm looking for a job\nUse tools like CV Builder, Career Coaching, and CareerConnect.",
  //   icon: "/icons/undraw_interview_yz52.svg",
  // },
  {
    title: "Tech Professional",
    role: "individualTechProfessional" as UserRole,
    description:
      "I'm working and want to upskill or transition\nJoin live trainings, certifications, and mentorship programs.\nUse tools like CV Builder, Career Coaching, and CareerConnect.",
    icon: "/icons/undraw_online-learning_tgmv.svg",
  },
  {
    title: "Recruiter",
    role: "recruiter" as UserRole,
    description:
      "I'm hiring or training a team\nPost jobs, browse talent, and manage internal upskilling.",
    icon: "/icons/undraw_hiring_8szx.svg",
  },
  {
    title: "Institution",
    role: "institution" as UserRole,
    description:
      "I'm representing an institution\nManage students, courses, and institutional data.",
    icon: "/icons/undraw_teacher_s628.svg",
  },
  // {
  //   title: "Admin",
  //   role: "admin" as UserRole,
  //   description: "I'm an admin\nManage the platform and users.",
  //   icon: "/icons/undraw_teacher_s628.svg",
  // },
];

const roleDashboardMap: Record<string, string> = {
  student: "/onboarding/student",
  // graduate: "/onboarding/tech-professional",
  individualTechProfessional: "/onboarding/tech-professional",
  teamTechProfessional: "/onboarding/team-tech-professional",
  recruiter: "/onboarding/company",
  institution: "/onboarding/institution",
  admin: "/onboarding/admin",
};

const OnboardingPage = () => {
  const router = useRouter();
  const { loginWithOAuth } = useRole();

  const handleRoleSelection = (role: UserRole) => {
    // Mock user data - in real app, this would come from registration/login
    const mockUserData = {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/assets/placeholder-avatar.jpg",
      role: role,
    };

    // Always use lowercased role for login and redirection
    const normalizedRole = role.toLowerCase();
    loginWithOAuth(mockUserData);

    // Redirect to the correct dashboard
    const dashboardRoute = roleDashboardMap[normalizedRole] || "/onboarding";
    router.push(dashboardRoute);
  };

  return (
    <AuthGuard>
      <div>
        <header className="mx-auto px-4 md:px-16 pt-16 pb-16 flex flex-col items-center justify-center text-center bg-[#0D1140] h-full w-full md:h-[80vh]">
          <span className="bg-black text-white font-semibold text-md rounded-full mb-3 px-6 py-2 mt-20">
            Let's personalize your experience
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white sm:text-xl pb-4">
            What Best Describes Your Goal?
          </h1>
          <p className="text-lg text-gray-200 font-medium max-w-[70vw] mx-auto mt-4">
            Choose the option that fits you most right now. We'll customize your
            dashboard, tools, and suggestions based on your selection. You can
            always update this later.
          </p>
        </header>

        <section className="p-6 md:p-10 py-24 max-w-6xl mx-auto text-gray-800">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-outline text-white text-center pb-12">
            Role Selection
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div
                key={role.title}
                className="flex flex-row items-center bg-gray-100 rounded-xl px-4 py-4 md:py-8 gap-4 transition transform hover:scale-[1.02] hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none cursor-pointer"
                onClick={() => handleRoleSelection(role.role)}
              >
                <div className="w-32 sm:flex-shrink-0">
                  <Image
                    src={role.icon}
                    alt=""
                    width={120}
                    height={120}
                    className="mx-auto sm:mx-0"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1">{role.title}</h2>
                  <p className="text-sm text-gray-600 mb-3 whitespace-pre-line">
                    {role.description}
                  </p>
                  <button
                    className="inline-block px-6 py-2 rounded-[10px] bg-[#0D1140] text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Select role ${role.title}`}
                  >
                    Select →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="mt-8 flex text-left md:text-center items-center justify-center gap-2 md:gap-6">
            <p className="text-md md:text-[1.2rem] text-gray-600">
              Not sure yet?
            </p>
            <Link
              href="/services"
              className="inline-block px-3 md:px-6 py-2 rounded-[10px] bg-gray-200 text-md md:text-[1.2rem] font-medium text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-fit"
            >
              Explore all services →
            </Link>
          </div> */}
        </section>

        <section className="bg-white py-16 px-4 md:px-16 mx-auto">
          <div className="bg-gray-200 text-center px-6 py-10 sm:p-12 md:p-24 rounded-[15px]">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Trust Note</h2>
            <p className="text-xl">
              This helps us show you what matters most — nothing is public or
              shared.
            </p>
          </div>
        </section>
      </div>
    </AuthGuard>
  );
};

export default OnboardingPage;
