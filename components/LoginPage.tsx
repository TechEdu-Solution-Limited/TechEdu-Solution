// @/login/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/contexts/RoleContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { loginUser } from "@/lib/apiFetch";
import {
  saveTokenToCookies,
  setCookie,
  saveTokensToCookies,
} from "@/lib/cookies";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const router = useRouter();
  const { setUserRole, setUserData, setIsAuthenticated } = useRole();

  // Get redirect parameter directly from URL
  const redirectParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null;
  const redirectTo = redirectParam || "/dashboard";

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const error =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("error")
        : null;
    if (error) {
      switch (error) {
        case "oauth_failed":
          setOauthError("Google authentication failed. Please try again.");
          break;
        case "no_code":
          setOauthError("Authentication was cancelled.");
          break;
        case "auth_failed":
          setOauthError("Authentication failed. Please try again.");
          break;
        default:
          setOauthError("An error occurred during authentication.");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for current field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const toggleVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  // Local login function
  const login = async (email: string, password: string) => {
    const { data, status, message } = await loginUser({ email, password });
    if (status >= 400) throw new Error(message || "Login failed");

    const userData = data.data.user;
    const accessToken = data.data.access_token;
    const refreshToken = data.data.refresh_token;

    if (!accessToken) throw new Error("No authentication token received");

    // Save both access and refresh tokens
    if (refreshToken) {
      saveTokensToCookies(accessToken, refreshToken);
    } else {
      // Fallback to just saving access token if no refresh token
      saveTokenToCookies(accessToken);
    }

    document.cookie = `userData=${encodeURIComponent(
      JSON.stringify(userData)
    )}; path=/; max-age=${7 * 24 * 60 * 60}; secure=${
      process.env.NODE_ENV === "production"
    }; samesite=lax`;

    // Update RoleContext state immediately
    setUserRole(userData.role || "student");
    setUserData(userData);
    setIsAuthenticated(true); // Set authentication state to true

    return userData;
  };

  // Function to determine redirect route based on user role and onboarding status
  const getRedirectRoute = (userData: any) => {
    const { role, onboardingStatus, id } = userData;

    // Store userId in cookie for onboarding if needed
    if (id) {
      setCookie("userId", id, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    // PRIORITY 1: If there's a redirect parameter, use it (highest priority)
    if (
      redirectTo &&
      redirectTo !== "/dashboard" &&
      redirectTo.startsWith("/")
    ) {
      // Only allow students to access /cart
      if (redirectTo === "/cart" && role !== "student") {
        toast.error(
          "Only students can purchase from the catalog. Please log in with a student account."
        );
        return "/dashboard";
      }
      return redirectTo;
    }

    // PRIORITY 2: If onboarding is not completed, route to onboarding
    if (
      onboardingStatus === "not_started" ||
      onboardingStatus === "in_progress"
    ) {
      switch (role) {
        case "student":
          return `/onboarding/student?userId=${id}${
            redirectTo && redirectTo !== "/dashboard"
              ? `&redirect=${encodeURIComponent(redirectTo)}`
              : ""
          }`;
        case "recruiter":
          return `/onboarding/recruiter?userId=${id}`;
        case "institution":
          return `/onboarding/institution?userId=${id}`;
        case "individualTechProfessional":
          return `/onboarding/tech-professional?userId=${id}`;
        case "teamTechProfessional":
          return `/onboarding/team-tech-professional?userId=${id}`;
        default:
          return `/onboarding?userId=${id}`;
      }
    }

    // PRIORITY 3: If onboarding is completed, use role-specific dashboard
    const roleToDashboardRoute: Record<string, string> = {
      student: "student",
      recruiter: "recruiter",
      institution: "institution",
      individualTechProfessional: "individual-tech-professional",
      teamTechProfessional: "team-tech-professional",
    };
    if (onboardingStatus === "completed") {
      const dashboardRoute = `/dashboard/${
        roleToDashboardRoute[role] || "student"
      }`;
      return dashboardRoute;
    }

    // PRIORITY 4: Fallback to role-specific dashboard (in case onboardingStatus is undefined)
    const fallbackRoute = `/dashboard/${
      roleToDashboardRoute[role] || "student"
    }`;
    return fallbackRoute;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success("Login successful!");

      // Use the getRedirectRoute function to properly handle onboarding status
      const targetRoute = getRedirectRoute(user);

      // Small delay to ensure authentication state is updated
      setTimeout(() => {
        router.push(targetRoute);
      }, 100);
    } catch (error: any) {
      // Handle the backend error structure with error.details array
      if (error?.error?.details && Array.isArray(error.error.details)) {
        toast.error(error.error.details.join(", "));
      } else if (error?.details && Array.isArray(error.details)) {
        toast.error(error.details.join(", "));
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    setIsGoogleLoading(true);
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
    } catch (error) {
      toast.error("Failed to initiate Google login.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-between bg-[url('/assets/authImg.jpg')] bg-cover bg-no-repeat bg-center text-gray-900 py-10 px-4 md:px-20">
      {/* Left Side */}
      <div className="w-full max-w-[35rem] bg-white/90 backdrop-blur-md py-8 md:py-14 px-6 md:px-16 rounded-[15px] rounded-br-[8rem] shadow-2xl mt-10 lg:mt-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 bg-[#003294] hover:bg-blue-500 text-white text-left p-2 mb-6 rounded-[10px] block min-[1240px]:hidden"
        >
          ← Go Back
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-1 text-[#003294] max-w-[80%]">
            Welcome Back to TechEdu Solution
          </h2>

          <Link
            href="/"
            className="bg-[#003294] hover:bg-blue-500 text-white text-left p-2 mb-6 rounded-[10px] block"
          >
            Go Home
          </Link>
        </div>
        <p className="text-sm text-gray-600 mb-6 max-w-[75%]">
          Whether you're returning to edit your CV, track a scholarship
          application, or manage your training — you're just one step away
        </p>

        {/* OAuth Error Alert */}
        {oauthError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{oauthError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#011F72]"
              aria-label="Email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={formData.showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-[10px] pr-10 focus:outline-none focus:ring-2 focus:ring-[#011F72]"
              aria-label="Password"
              required
            />
            <div
              className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
              onClick={toggleVisibility}
            >
              {formData.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" required />
            <span>Remember me</span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-[10px] font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-[#011F72] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || isGoogleLoading}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-right my-4">
          <Link
            href="/forgot-password"
            className="text-[1rem] text-[#003294] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="w-full flex items-center justify-center gap-4">
          <span className="w-28 h-[2px] rounded-[10px] bg-gray-600"></span>
          <div className="text-center text-sm text-gray-600 py-2">
            or continue with
          </div>
          <span className="w-28 h-[2px] rounded-[10px] bg-gray-600"></span>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-[10px] text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Login with Google"
          onClick={handleGoogleLogin}
          disabled={isSubmitting || isGoogleLoading}
        >
          <Image src="/icons/search.png" height={20} width={20} alt="Google" />
          {isGoogleLoading ? "Redirecting..." : "Sign in with Google"}
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 py-2 rounded-[10px] text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          aria-label="Login with LinkedIn"
          disabled={isSubmitting || isGoogleLoading}
        >
          <Image
            src="/icons/linkedin.png"
            height={20}
            width={20}
            alt="LinkedIn"
          />
          Login with LinkedIn
        </button>

        <p className="text-[1rem] text-center mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#003294] font-bold underline">
            Create One
          </Link>
        </p>
      </div>

      {/* Right Side */}
      <div className="hidden min-[1240px]:block w-full lg:w-1/2 text-white space-y-6 mt-12 lg:mt-0 lg:pl-20">
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-4 bg-white hover:bg-blue-500 text-[#003294] text-left p-2 mb-6 rounded-[10px] hidden min-[1240px]:block"
        >
          ← Go Back
        </button>
        <h2 className="text-xl font-bold max-w-md">
          Access all tools with one secure account.
        </h2>

        <div className="relative max-w-md rounded-md h-[250px] overflow-hidden">
          <Image
            src="/assets/authImage.webp"
            alt="Decoration"
            fill
            className="object-cover w-full h-full rounded-md"
            priority
          />
        </div>

        <h3 className="text-lg font-semibold mt-6">Quick Benefits Reminder</h3>
        <div className="max-w-md bg-white/10 backdrop-blur-md p-6 rounded-[10px] border border-white/20">
          <ul className="list-disc list-inside text-sm text-white">
            <li>Resume Builder access</li>
            <li>Scholarship coaching progress</li>
            <li>Build and save support packages</li>
            <li>Saved training sessions</li>
            <li>Download certificates</li>
            <li>Booking history with coaches</li>
            <li>CareerConnect profile management</li>
          </ul>
        </div>

        <p className="text-sm font-medium pt-6">
          One login. All tools. Seamless experience.
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
