import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, File, Image, FileText, Download } from "lucide-react";
import { toast } from "react-toastify";
import {
  uploadAssetImage,
  uploadAttachment,
  uploadMaterial,
  deleteFileFromFirebase,
  STORAGE_FOLDERS,
  type StorageFolder,
} from "@/lib/firebase";

interface FileUploadProps {
  onFileUploaded: (url: string, fileName: string) => void;
  onFileRemoved?: (url: string) => void;
  folder: StorageFolder;
  subfolder?: string;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  existingFiles?: Array<{ url: string; name: string }>;
  className?: string;
}

export default function FileUpload({
  onFileUploaded,
  onFileRemoved,
  folder,
  subfolder,
  acceptedTypes = "*",
  maxSize = 10, // 10MB default
  multiple = false,
  existingFiles = [],
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate file size
    const oversizedFiles = fileArray.filter(
      (file) => file.size > maxSize * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error(`Files must be smaller than ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      for (const file of fileArray) {
        let downloadURL: string;

        // Choose upload function based on folder
        switch (folder) {
          case STORAGE_FOLDERS.ASSETS:
            downloadURL = await uploadAssetImage(file, subfolder);
            break;
          case STORAGE_FOLDERS.ATTACHMENTS:
            downloadURL = await uploadAttachment(file, subfolder);
            break;
          case STORAGE_FOLDERS.MATERIALS:
            downloadURL = await uploadMaterial(file, subfolder);
            break;
          default:
            throw new Error("Invalid storage folder");
        }

        onFileUploaded(downloadURL, file.name);
        toast.success(`${file.name} uploaded successfully`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveFile = async (url: string) => {
    try {
      await deleteFileFromFirebase(url);
      onFileRemoved?.(url);
      toast.success("File removed successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove file");
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
    ) {
      return <Image className="w-4 h-4" />;
    }
    if (["pdf", "doc", "docx", "txt"].includes(extension || "")) {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-[10px] p-6 text-center transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or click to select
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Max size: {maxSize}MB • Accepted: {acceptedTypes}
        </p>
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
        >
          {uploading ? "Uploading..." : "Choose Files"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          <div className="space-y-2">
            {existingFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-[10px]"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.url.includes("firebase")
                        ? "Firebase Storage"
                        : "External URL"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  {onFileRemoved && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(file.url)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
