"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Image,
  File,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  FolderOpen,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface Document {
  id: string;
  name: string;
  type: "academic" | "certificate" | "cv" | "portfolio" | "other";
  category: string;
  fileSize: number; // in bytes
  uploadDate: string;
  status: "uploaded" | "processing" | "verified" | "rejected";
  description?: string;
  tags: string[];
  downloadUrl?: string;
  previewUrl?: string;
}

interface DocumentCategory {
  name: string;
  icon: string;
  description: string;
  required: boolean;
  maxFiles: number;
  allowedTypes: string[];
  maxSize: number; // in MB
}

export default function UploadDocumentsPage() {
  const { userData } = useRole();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const categories: DocumentCategory[] = [
    {
      name: "Academic Documents",
      icon: "FileText",
      description: "Transcripts, diplomas, academic certificates",
      required: true,
      maxFiles: 10,
      allowedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 10,
    },
    {
      name: "Professional Certificates",
      icon: "Award",
      description: "Professional certifications and training certificates",
      required: false,
      maxFiles: 15,
      allowedTypes: [".pdf", ".jpg", ".jpeg", ".png"],
      maxSize: 5,
    },
    {
      name: "CV & Resume",
      icon: "FileText",
      description: "Current CV, resume, and cover letters",
      required: true,
      maxFiles: 5,
      allowedTypes: [".pdf", ".doc", ".docx"],
      maxSize: 2,
    },
    {
      name: "Portfolio",
      icon: "FolderOpen",
      description: "Project portfolios and work samples",
      required: false,
      maxFiles: 20,
      allowedTypes: [".pdf", ".jpg", ".jpeg", ".png", ".zip"],
      maxSize: 50,
    },
    {
      name: "Other Documents",
      icon: "File",
      description: "Additional supporting documents",
      required: false,
      maxFiles: 10,
      allowedTypes: [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"],
      maxSize: 10,
    },
  ];

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockDocuments: Document[] = [
      {
        id: "1",
        name: "Bachelor_Degree_Transcript.pdf",
        type: "academic",
        category: "Academic Documents",
        fileSize: 2048576, // 2MB
        uploadDate: "2024-01-15",
        status: "verified",
        description: "Official transcript from University of Technology",
        tags: ["transcript", "degree", "academic"],
        downloadUrl: "#",
        previewUrl: "#",
      },
      {
        id: "2",
        name: "AWS_Certification.pdf",
        type: "certificate",
        category: "Professional Certificates",
        fileSize: 1048576, // 1MB
        uploadDate: "2024-01-10",
        status: "verified",
        description: "AWS Solutions Architect Associate certification",
        tags: ["aws", "cloud", "certification"],
        downloadUrl: "#",
        previewUrl: "#",
      },
      {
        id: "3",
        name: "Resume_2024.pdf",
        type: "cv",
        category: "CV & Resume",
        fileSize: 512000, // 500KB
        uploadDate: "2024-01-20",
        status: "uploaded",
        description: "Updated resume with latest experience",
        tags: ["resume", "cv", "career"],
        downloadUrl: "#",
        previewUrl: "#",
      },
      {
        id: "4",
        name: "Project_Portfolio.zip",
        type: "portfolio",
        category: "Portfolio",
        fileSize: 15728640, // 15MB
        uploadDate: "2024-01-18",
        status: "processing",
        description: "Collection of software development projects",
        tags: ["portfolio", "projects", "development"],
        downloadUrl: "#",
      },
      {
        id: "5",
        name: "Reference_Letter.pdf",
        type: "other",
        category: "Other Documents",
        fileSize: 307200, // 300KB
        uploadDate: "2024-01-12",
        status: "verified",
        description: "Professional reference letter from previous employer",
        tags: ["reference", "letter", "professional"],
        downloadUrl: "#",
        previewUrl: "#",
      },
    ];

    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "uploaded":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return CheckCircle;
      case "uploaded":
        return Upload;
      case "processing":
        return Clock;
      case "rejected":
        return AlertCircle;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    // Simulate upload process
    setTimeout(() => {
      const newDocuments: Document[] = selectedFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: "other" as const,
        category: "Other Documents",
        fileSize: file.size,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "uploaded" as const,
        tags: [],
        downloadUrl: "#",
      }));

      setDocuments((prev) => [...newDocuments, ...prev]);
      setSelectedFiles([]);
      setUploading(false);
    }, 2000);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);
  const verifiedCount = documents.filter(
    (doc) => doc.status === "verified"
  ).length;
  const processingCount = documents.filter(
    (doc) => doc.status === "processing"
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upload Documents</h1>
          <p className="text-gray-600 mt-2">
            Manage your academic documents, certificates, and portfolio files
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Upload New Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Documents
                </p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold">{verifiedCount}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold">{processingCount}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-[10px]">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(totalSize)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <FolderOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="border-2 border-dashed border-gray-300 rounded-[10px] p-4 hover:border-blue-400 transition-colors"
                >
                  <div className="text-center">
                    <div className="p-2 bg-blue-100 rounded-[10px] w-fit mx-auto mb-2">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {category.description}
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Max files: {category.maxFiles}</p>
                      <p>Max size: {category.maxSize}MB</p>
                      {category.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-[10px] p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" className="mb-2">
                    Choose Files
                  </Button>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip"
                />
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX, ZIP (Max 50MB per
                  file)
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Selected Files:</h4>
                  <div className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                      >
                        <span>{file.name}</span>
                        <span className="text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="mt-4"
                  >
                    {uploading ? "Uploading..." : "Upload Files"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Documents</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Upload your first document to get started."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => {
                const StatusIcon = getStatusIcon(doc.status);
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-[10px] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-[10px]">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-600">{doc.category}</p>
                        {doc.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {doc.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatFileSize(doc.fileSize)}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(doc.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {doc.status}
                      </Badge>

                      <div className="flex items-center space-x-1">
                        {doc.previewUrl && (
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {doc.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
