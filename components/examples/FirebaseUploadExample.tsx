import React, { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { STORAGE_FOLDERS } from "@/lib/firebase";

export default function FirebaseUploadExample() {
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ url: string; name: string }>
  >([]);

  const handleFileUploaded = (url: string, fileName: string) => {
    setUploadedFiles((prev) => [...prev, { url, name: fileName }]);
  };

  const handleFileRemoved = (url: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.url !== url));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Firebase Storage Upload Examples
      </h1>

      {/* Assets Upload (Images) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Assets Upload (Images)
        </h2>
        <FileUpload
          folder={STORAGE_FOLDERS.ASSETS}
          subfolder="profile-images"
          acceptedTypes="image/*"
          maxSize={5}
          onFileUploaded={handleFileUploaded}
          onFileRemoved={handleFileRemoved}
          existingFiles={uploadedFiles}
        />
      </div>

      {/* Attachments Upload (Documents) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Attachments Upload (Documents)
        </h2>
        <FileUpload
          folder={STORAGE_FOLDERS.ATTACHMENTS}
          subfolder="user-uploads"
          acceptedTypes=".pdf,.doc,.docx,.txt,.jpg,.png"
          maxSize={10}
          multiple={true}
          onFileUploaded={handleFileUploaded}
          onFileRemoved={handleFileRemoved}
          existingFiles={uploadedFiles}
        />
      </div>

      {/* Materials Upload (Training Materials) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Materials Upload (Training Materials)
        </h2>
        <FileUpload
          folder={STORAGE_FOLDERS.MATERIALS}
          subfolder="course-materials"
          acceptedTypes="*"
          maxSize={50}
          multiple={true}
          onFileUploaded={handleFileUploaded}
          onFileRemoved={handleFileRemoved}
          existingFiles={uploadedFiles}
        />
      </div>

      {/* Display Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Uploaded Files
          </h2>
          <div className="bg-gray-50 p-4 rounded-[10px]">
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(uploadedFiles, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
