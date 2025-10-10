import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileText, FileSpreadsheet, X } from "lucide-react";
import { uploadAttachment } from "@/lib/firebase";
import { toast } from "react-toastify";

interface Step6SupportingDocumentsProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export function Step6SupportingDocuments({
  form,
  errors,
  handleChange,
}: Step6SupportingDocumentsProps) {
  const [uploadingCompanyIntro, setUploadingCompanyIntro] = useState(false);
  const [uploadingSkillMatrix, setUploadingSkillMatrix] = useState(false);

  const handleFileUpload = async (
    file: File,
    fieldName: string,
    setUploading: (loading: boolean) => void
  ) => {
    // Validate file type
    const allowedTypes = {
      companyIntroUrl: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      skillMatrixUrl: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ],
      projectSamplesUrl: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/zip",
        "application/x-rar-compressed",
      ],
      ndaOrAgreementUrl: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    };

    if (
      !allowedTypes[fieldName as keyof typeof allowedTypes]?.includes(file.type)
    ) {
      toast.error(`Invalid file type. Please upload a valid document.`);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      const downloadURL = await uploadAttachment(file, "supporting-documents");

      // Update form with the uploaded URL using nested field name
      const event = {
        target: {
          name: `attachments.${fieldName}`,
          value: downloadURL,
        },
      } as any;
      handleChange(event);

      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (fieldName: string) => {
    const event = {
      target: {
        name: `attachments.${fieldName}`,
        value: "",
      },
    } as any;
    handleChange(event);
  };
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">Supporting Documents</h4>
        <p className="text-sm text-blue-800">
          Upload supporting documents to help us better understand your team's
          needs and provide more targeted training recommendations. These
          documents are optional but highly recommended.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-[10px] p-4">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h5 className="font-medium text-gray-900">
                Company Introduction
              </h5>
              <p className="text-sm text-gray-600">
                Company overview and background
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* File Upload */}
            <div>
              <input
                type="file"
                id="companyIntroFile"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(
                      file,
                      "companyIntroUrl",
                      setUploadingCompanyIntro
                    );
                  }
                }}
                className="hidden"
                disabled={uploadingCompanyIntro}
              />
              <label
                htmlFor="companyIntroFile"
                className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors ${
                  uploadingCompanyIntro ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingCompanyIntro ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Upload Company Introduction
                    </span>
                  </>
                )}
              </label>
            </div>

            {/* Show uploaded file */}
            {form.attachments?.companyIntroUrl && (
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-[10px]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Document uploaded successfully
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument("companyIntroUrl")}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>Recommended formats: PDF, DOC, DOCX</p>
              <p>Max size: 10MB</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-[10px] p-4">
          <div className="flex items-center space-x-3 mb-3">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            <div>
              <h5 className="font-medium text-gray-900">Skill Matrix</h5>
              <p className="text-sm text-gray-600">Team skills assessment</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* File Upload */}
            <div>
              <input
                type="file"
                id="skillMatrixFile"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(
                      file,
                      "skillMatrixUrl",
                      setUploadingSkillMatrix
                    );
                  }
                }}
                className="hidden"
                disabled={uploadingSkillMatrix}
              />
              <label
                htmlFor="skillMatrixFile"
                className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors ${
                  uploadingSkillMatrix ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingSkillMatrix ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Upload Skill Matrix
                    </span>
                  </>
                )}
              </label>
            </div>

            {/* Show uploaded file */}
            {form.attachments?.skillMatrixUrl && (
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-[10px]">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Document uploaded successfully
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument("skillMatrixUrl")}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>Recommended formats: XLSX, XLS, CSV</p>
              <p>Max size: 10MB</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-[10px] p-4">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-6 h-6 text-purple-600" />
            <div>
              <h5 className="font-medium text-gray-900">Project Samples</h5>
              <p className="text-sm text-gray-600">
                Portfolio or project examples
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <input
                type="file"
                id="projectSamplesFile"
                accept=".pdf,.doc,.docx,.zip,.rar"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(
                      file,
                      "projectSamplesUrl",
                      setUploadingCompanyIntro
                    );
                  }
                }}
                className="hidden"
                disabled={uploadingCompanyIntro}
              />
              <label
                htmlFor="projectSamplesFile"
                className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors ${
                  uploadingCompanyIntro ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingCompanyIntro ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Upload Project Samples
                    </span>
                  </>
                )}
              </label>
            </div>

            {form.attachments?.projectSamplesUrl && (
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-[10px]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Document uploaded successfully
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument("projectSamplesUrl")}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>Recommended formats: PDF, DOC, DOCX, ZIP, RAR</p>
              <p>Max size: 10MB</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-[10px] p-4">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-6 h-6 text-red-600" />
            <div>
              <h5 className="font-medium text-gray-900">NDA or Agreement</h5>
              <p className="text-sm text-gray-600">
                Legal documents or agreements
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <input
                type="file"
                id="ndaOrAgreementFile"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(
                      file,
                      "ndaOrAgreementUrl",
                      setUploadingSkillMatrix
                    );
                  }
                }}
                className="hidden"
                disabled={uploadingSkillMatrix}
              />
              <label
                htmlFor="ndaOrAgreementFile"
                className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors ${
                  uploadingSkillMatrix ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingSkillMatrix ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Upload NDA or Agreement
                    </span>
                  </>
                )}
              </label>
            </div>

            {form.attachments?.ndaOrAgreementUrl && (
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-[10px]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Document uploaded successfully
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument("ndaOrAgreementUrl")}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>Recommended formats: PDF, DOC, DOCX</p>
              <p>Max size: 10MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4">
        <h4 className="font-medium text-yellow-900 mb-2">
          Document Guidelines
        </h4>
        <div className="text-sm text-yellow-800 space-y-2">
          <p>
            <strong>Company Introduction should include:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Company mission and vision</li>
            <li>Current projects and technologies used</li>
            <li>Team structure and roles</li>
            <li>Challenges and areas for improvement</li>
          </ul>

          <p className="mt-3">
            <strong>Skill Matrix should include:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Individual team member skills assessment</li>
            <li>Proficiency levels (Beginner, Intermediate, Advanced)</li>
            <li>Areas requiring training or development</li>
            <li>Career goals and aspirations</li>
          </ul>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-[10px] p-4">
        <h4 className="font-medium text-green-900 mb-2">
          Benefits of Providing Documents
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• More personalized training recommendations</li>
          <li>• Better understanding of team dynamics</li>
          <li>• Targeted skill development programs</li>
          <li>• Improved learning outcomes</li>
          <li>• Faster onboarding to training programs</li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-[10px] p-4">
        <h4 className="font-medium text-gray-900 mb-2">Privacy & Security</h4>
        <p className="text-sm text-gray-700">
          All uploaded documents are treated with strict confidentiality. They
          are only used for training program customization and will not be
          shared with third parties without your explicit consent.
        </p>
      </div>
    </div>
  );
}
