import React, { useEffect, useState, useRef, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApiRequest } from "@/lib/apiFetch";
import { getCookie } from "@/lib/cookies";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface RecruiterStep3CompanyLinkProps {
  form: {
    companyId?: string;
    companyName: string;
    industry: string;
    website?: string;
    rcNumber?: string;
  };
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  setFieldValue: (field: string, value: any) => void;
}

const industries = [
  "Technology",
  "Fintech",
  "Healthtech",
  "E-commerce",
  "Edtech",
  "SaaS",
  "Gaming",
  "AI/ML",
  "IoT",
  "Blockchain",
  "Consulting",
  "Manufacturing",
  "Other",
];

export default function RecruiterStep3CompanyLink({
  form,
  errors,
  handleChange,
  setFieldValue,
}: RecruiterStep3CompanyLinkProps) {
  const token = getCookie("token") || getCookie("access_token");
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [selectValue, setSelectValue] = useState<string>(form.companyId || "");
  const [customCompany, setCustomCompany] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  // Fetch all companies on mount
  useEffect(() => {
    getApiRequest<any>("/api/companies", token, { limit: 1000 })
      .then((data) => {
        console.log("Raw API response:", data);
        const companies = (data?.data?.data?.companies || []).map((c: any) => ({
          ...c,
          id: c._id,
        }));
        console.log("Fetched companies:", companies);
        setAllCompanies(companies);
      })
      .catch(() => {
        setAllCompanies([]);
      });
  }, [token]);

  // Handle select change
  const handleCompanySelect = (value: string) => {
    setSelectValue(value);
    if (value === "custom") {
      setShowCustomInput(true);
      setFieldValue("companyName", "");
      setFieldValue("website", "");
      setFieldValue("rcNumber", "");
      setFieldValue("companyId", "");
      setFieldValue("industry", "");
    } else {
      setShowCustomInput(false);
      const selected = allCompanies.find((c) => c.id === value);
      if (selected) {
        setFieldValue("companyName", selected.name);
        setFieldValue("website", selected.website || "");
        setFieldValue("rcNumber", selected.rcNumber || "");
        setFieldValue("companyId", selected.id);
        setFieldValue("industry", selected.industry || "");
      }
    }
  };

  // Handle custom company name input
  const handleCustomCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomCompany(e.target.value);
    setFieldValue("companyName", e.target.value);
    setFieldValue("website", "");
    setFieldValue("rcNumber", "");
    setFieldValue("companyId", "");
  };

  // Debug: log companyId before render
  console.log("companyId input value:", form.companyId);

  return (
    <div className="space-y-6 relative">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Name select with custom option */}
        <div className="space-y-2 relative">
          <Label htmlFor="companyName">Company Name *</Label>
          <Select
            value={selectValue || (showCustomInput ? "custom" : "")}
            onValueChange={handleCompanySelect}
            name="companyName"
          >
            <SelectTrigger
              className={
                errors.companyName ? "border-red-500" : "rounded-[10px]"
              }
            >
              <SelectValue placeholder="Select or enter company name" />
            </SelectTrigger>
            <SelectContent className="rounded-[10px] bg-white max-h-60 overflow-auto">
              {allCompanies.map((company) => (
                <SelectItem
                  key={company.id}
                  value={company.id}
                  className="cursor-pointer hover:bg-gray-300"
                >
                  {company.name}
                </SelectItem>
              ))}
              <SelectItem
                value="custom"
                className="cursor-pointer bg-blue-300 text-white hover:bg-gray-300"
              >
                Other (Enter new company)
              </SelectItem>
            </SelectContent>
          </Select>
          {showCustomInput && (
            <Input
              id="companyName"
              name="companyName"
              value={customCompany}
              onChange={handleCustomCompanyChange}
              placeholder="Enter new company name"
              autoComplete="off"
              className={
                errors.companyName
                  ? "border-red-500 mt-2"
                  : "rounded-[10px] mt-2"
              }
            />
          )}
          {errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName}</p>
          )}
        </div>

        {/* Industry with filterable select */}
        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Input
            id="industry-filter"
            placeholder="Type to filter industries"
            value={form.industry}
            onChange={(e) =>
              handleChange({
                target: { name: "industry", value: e.target.value },
              } as any)
            }
            className="rounded-[10px] mb-2"
            autoComplete="off"
            disabled={!showCustomInput}
          />
          <Select
            name="industry"
            value={form.industry}
            onValueChange={(value) =>
              handleChange({ target: { name: "industry", value } } as any)
            }
            disabled={!showCustomInput}
          >
            <SelectTrigger
              className={errors.industry ? "border-red-500" : "rounded-[10px]"}
            >
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent className="rounded-[10px] bg-white">
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-red-500 text-sm">{errors.industry}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rcNumber">RC Number</Label>
          <Input
            id="rcNumber"
            name="rcNumber"
            value={form.rcNumber || ""}
            onChange={handleChange}
            placeholder="e.g., RC123456"
            className="rounded-[10px]"
            disabled={!showCustomInput}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Company Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={form.website || ""}
            onChange={handleChange}
            placeholder="e.g., https://techsolutions.com"
            className="rounded-[10px]"
            disabled={!showCustomInput}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyId">Company ID (Optional)</Label>
          <Input
            id="companyId"
            name="companyId"
            value={form.companyId ?? selectValue ?? ""}
            onChange={handleChange}
            placeholder="e.g., 507f1f77bcf86cd799439011"
            className="rounded-[10px]"
            disabled={!showCustomInput}
          />
          <p className="text-xs text-gray-500">
            If your company is already registered on our platform
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-[10px]">
        <h4 className="font-semibold text-green-900 mb-2">
          Benefits of linking your company:
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Access to company-specific analytics and reports</li>
          <li>• Team collaboration features for multiple recruiters</li>
          <li>• Branded job postings with company logo</li>
          <li>• Centralized candidate management</li>
        </ul>
      </div>
    </div>
  );
}
