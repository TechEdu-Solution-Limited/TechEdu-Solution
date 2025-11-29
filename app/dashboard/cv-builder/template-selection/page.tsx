"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTokenFromCookies } from "@/lib/cookies";
import { getApiRequest } from "@/lib/apiFetch";
import safeConsole from "@/lib/console";

// All available templates
const allTemplates = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column layout for conservative industries",
    preview: "/templates/classic-preview.jpg",
    popular: true,
  },
  {
    id: "two-column",
    name: "Two Column",
    description:
      "Classic two-column layout perfect for experienced professionals",
    preview: "/templates/two-column-preview.jpg",
    popular: false,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with modern typography",
    preview: "/templates/modern-preview.jpg",
    popular: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Minimalist design focusing on content and readability",
    preview: "/templates/minimal-preview.jpg",
    popular: false,
  },
];

// Required product ID for CV Builder Pro
const REQUIRED_PRODUCT_ID = "6907d65747f7b7c61241eda5";
// Allowed templates for CV Builder Pro (classic and minimal only)
const ALLOWED_TEMPLATES = ["classic", "minimal"];

export default function TemplateSelection() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [hasCVBuilderPro, setHasCVBuilderPro] = useState<boolean | null>(null);
  const [entitlementLoading, setEntitlementLoading] = useState(true);
  const router = useRouter();

  // Check for CV Builder Pro entitlement
  useEffect(() => {
    const checkEntitlement = async () => {
      try {
        setEntitlementLoading(true);
        const token = getTokenFromCookies();
        
        if (!token) {
          // No token - redirect to purchase page
          router.replace("/career-development?search=cv builder pro plan#catalog");
          return;
        }

        // Fetch all entitlements
        const response = await getApiRequest("/api/me/entitlements?subjectType=product", token);
        
        // Extract entitlements from response
        let entitlements: any[] = [];
        if (Array.isArray(response?.data)) {
          entitlements = response.data;
        } else if (Array.isArray(response?.data?.items)) {
          entitlements = response.data.items;
        } else if (Array.isArray(response?.data?.data)) {
          entitlements = response.data.data;
        }

        // Check if user has the required productId entitlement with active status
        const hasProAccess = entitlements.some(
          (entitlement: any) =>
            entitlement.subjectId === REQUIRED_PRODUCT_ID &&
            entitlement.status === "active"
        );

        setHasCVBuilderPro(hasProAccess);
        
        // If no access, redirect to purchase page
        if (!hasProAccess) {
          router.replace("/career-development?search=cv builder pro plan#catalog");
        }
      } catch (err: any) {
        safeConsole.error("Error checking CV Builder entitlement:", err);
        setHasCVBuilderPro(false);
        // On error, redirect to purchase page
        router.replace("/career-development?search=cv builder pro plan#catalog");
      } finally {
        setEntitlementLoading(false);
      }
    };

    checkEntitlement();
  }, [router]);

  // Filter templates based on entitlement (only classic and minimal for CV Builder Pro)
  const templates = allTemplates.filter((t) => ALLOWED_TEMPLATES.includes(t.id));

  const handleContinue = () => {
    // Validate template is allowed
    if (!ALLOWED_TEMPLATES.includes(selectedTemplate)) {
      return;
    }
    // Navigate to the CV builder with selected template, starting a fresh CV
    router.push(`/dashboard/cv-builder/${selectedTemplate}?new=1`);
  };

  // Show loading state while checking entitlements
  if (entitlementLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Checking Access...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Verifying your CV Builder Pro access
          </p>
        </div>
      </div>
    );
  }

  // If user doesn't have access, they will be redirected, but show a message while redirecting
  if (hasCVBuilderPro === false) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Redirecting...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please purchase CV Builder Pro to continue
          </p>
        </div>
      </div>
    );
  }

  // Don't render the page if access check hasn't completed
  if (hasCVBuilderPro !== true) {
    return null;
  }

  const handleContinue = () => {
    // Navigate to the CV builder with selected template, starting a fresh CV
    router.push(`/dashboard/cv-builder/${selectedTemplate}?new=1`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard/cv-builder"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to CV Builder
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Template
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select a professional template that best represents your style and
            industry. You can always change it later.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all cursor-pointer ${
                selectedTemplate === template.id
                  ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {/* Popular Badge */}
              {template.popular && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Popular
                </div>
              )}

              {/* Selection Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <div className="p-6">
                {/* Template Preview */}
                <div className="bg-gray-100 dark:bg-gray-700 rounded-[10px] h-48 mb-4 flex items-center justify-center">
                  <Image
                    src={template.preview}
                    alt={template.name}
                    width={300}
                    height={200}
                  />
                </div>

                {/* Template Info */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-[10px] transition-colors text-lg"
          >
            Continue with{" "}
            {templates.find((t) => t.id === selectedTemplate)?.name}
          </button>
        </div>
      </div>
    </div>
  );
}
