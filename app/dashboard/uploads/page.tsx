"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Upload,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
} from "lucide-react";

interface UploadHistory {
  id: string;
  fileName: string;
  status: "success" | "failed" | "pending";
  uploadedAt: string;
}

interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  type: string;
  submittedAt: string;
  status: "approved" | "pending" | "rejected";
  document: string;
}

export default function UploadsPage() {
  // Upload Professionals
  const [filePro, setFilePro] = useState<File | null>(null);
  const [uploadingPro, setUploadingPro] = useState(false);
  const [historyPro, setHistoryPro] = useState<UploadHistory[]>([
    {
      id: "1",
      fileName: "professionals_june.csv",
      status: "success",
      uploadedAt: "2024-06-01",
    },
    {
      id: "2",
      fileName: "batch_may.xlsx",
      status: "failed",
      uploadedAt: "2024-05-28",
    },
    {
      id: "3",
      fileName: "april_upload.csv",
      status: "success",
      uploadedAt: "2024-04-30",
    },
  ]);

  // Upload Docs
  const [fileDoc, setFileDoc] = useState<File | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [historyDoc, setHistoryDoc] = useState<UploadHistory[]>([
    {
      id: "1",
      fileName: "student_id_batch.pdf",
      status: "success",
      uploadedAt: "2024-06-01",
    },
    {
      id: "2",
      fileName: "transcripts_may.zip",
      status: "failed",
      uploadedAt: "2024-05-28",
    },
    {
      id: "3",
      fileName: "certificates_april.pdf",
      status: "success",
      uploadedAt: "2024-04-30",
    },
  ]);

  // Verification Requests
  const [requests, setRequests] = useState<VerificationRequest[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@university.edu",
      type: "Student ID",
      submittedAt: "2024-06-01",
      status: "approved",
      document: "student_id_sarah.pdf",
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike.chen@university.edu",
      type: "Transcript",
      submittedAt: "2024-06-02",
      status: "pending",
      document: "transcript_mike.pdf",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@university.edu",
      type: "Certificate",
      submittedAt: "2024-06-03",
      status: "rejected",
      document: "certificate_emily.pdf",
    },
  ]);

  // Handlers
  const handleFileChangePro = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFilePro(e.target.files[0]);
  };
  const handleUploadPro = () => {
    if (!filePro) return;
    setUploadingPro(true);
    setTimeout(() => {
      setHistoryPro([
        {
          id: Math.random().toString(),
          fileName: filePro.name,
          status: "success",
          uploadedAt: new Date().toISOString(),
        },
        ...historyPro,
      ]);
      setFilePro(null);
      setUploadingPro(false);
    }, 1200);
  };
  const handleFileChangeDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFileDoc(e.target.files[0]);
  };
  const handleUploadDoc = () => {
    if (!fileDoc) return;
    setUploadingDoc(true);
    setTimeout(() => {
      setHistoryDoc([
        {
          id: Math.random().toString(),
          fileName: fileDoc.name,
          status: "success",
          uploadedAt: new Date().toISOString(),
        },
        ...historyDoc,
      ]);
      setFileDoc(null);
      setUploadingDoc(false);
    }, 1200);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#011F72]">
            Uploads & Verification
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all uploads and verification requests in one place.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <Tabs defaultValue="professionals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="professionals">Upload Professionals</TabsTrigger>
          <TabsTrigger value="docs">Upload Docs</TabsTrigger>
          <TabsTrigger value="verification">Verification Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="professionals" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChangePro}
                />
                <Button
                  onClick={handleUploadPro}
                  disabled={!filePro || uploadingPro}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingPro ? "Uploading..." : "Upload"}
                </Button>
                {filePro && (
                  <span className="text-sm text-gray-600">{filePro.name}</span>
                )}
              </div>
            </CardContent>
          </Card>
          <div>
            <h2 className="text-lg font-semibold mb-2">Upload History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyPro.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex items-center space-x-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">{item.fileName}</div>
                      <div className="text-xs text-gray-500">
                        Uploaded:{" "}
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    {item.status === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                    )}
                    {item.status === "failed" && (
                      <XCircle className="w-5 h-5 text-red-600 ml-2" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept=".pdf,.zip,.doc,.docx"
                  onChange={handleFileChangeDoc}
                />
                <Button
                  onClick={handleUploadDoc}
                  disabled={!fileDoc || uploadingDoc}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingDoc ? "Uploading..." : "Upload"}
                </Button>
                {fileDoc && (
                  <span className="text-sm text-gray-600">{fileDoc.name}</span>
                )}
              </div>
            </CardContent>
          </Card>
          <div>
            <h2 className="text-lg font-semibold mb-2">Upload History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {historyDoc.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 flex items-center space-x-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">{item.fileName}</div>
                      <div className="text-xs text-gray-500">
                        Uploaded:{" "}
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    {item.status === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                    )}
                    {item.status === "failed" && (
                      <XCircle className="w-5 h-5 text-red-600 ml-2" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="verification" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {requests.map((req) => (
              <Card key={req.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {req.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{req.name}</h3>
                      <p className="text-gray-600 text-sm">{req.type}</p>
                      <p className="text-gray-500 text-xs">{req.email}</p>
                    </div>
                    <Badge className={getStatusColor(req.status)}>
                      {req.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4 mr-1" />
                    <span>{req.document}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>
                      Submitted:{" "}
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
