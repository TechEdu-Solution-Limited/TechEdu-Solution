import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  Trash2,
  File,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { useFirebaseStorageFetch } from "@/hooks/useFirebaseStorageFetch";

export default function FirebaseStorageFetchExample() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [downloadURL, setDownloadURL] = useState("");
  const [fileMetadata, setFileMetadata] = useState<any>(null);
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const [uploadPath, setUploadPath] = useState("assets/test-uploads");
  const [authToken, setAuthToken] = useState("");

  const {
    uploading,
    downloading,
    progress,
    uploadFile,
    downloadFile,
    getMetadata,
    deleteFile,
    checkFileExists,
    createDownload,
  } = useFirebaseStorageFetch({
    onSuccess: (url, fileName) => {
      console.log("Upload successful:", url, fileName);
      setDownloadURL(url);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDownloadURL("");
      setFileMetadata(null);
      setFileExists(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const url = await uploadFile(
        selectedFile,
        uploadPath,
        authToken || undefined
      );
      setDownloadURL(url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDownload = async () => {
    if (!downloadURL) return;

    try {
      await downloadFile(
        downloadURL,
        selectedFile?.name,
        authToken || undefined
      );
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleGetMetadata = async () => {
    if (!downloadURL) return;

    try {
      const metadata = await getMetadata(downloadURL, authToken || undefined);
      setFileMetadata(metadata);
    } catch (error) {
      console.error("Get metadata failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!downloadURL || !authToken) return;

    try {
      await deleteFile(downloadURL, authToken);
      setDownloadURL("");
      setFileMetadata(null);
      setFileExists(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCheckExists = async () => {
    if (!downloadURL) return;

    try {
      const exists = await checkFileExists(downloadURL);
      setFileExists(exists);
    } catch (error) {
      console.error("Check exists failed:", error);
    }
  };

  const handleCreateDownloadLink = () => {
    if (!downloadURL) return;
    createDownload(downloadURL, selectedFile?.name);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Firebase Storage Fetch API Example
      </h1>

      {/* File Selection */}
      <Card>
        <CardHeader>
          <CardTitle>1. Select File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" onChange={handleFileSelect} className="w-full" />
          {selectedFile && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <File className="w-4 h-4" />
              <span>
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>2. Upload Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Path
            </label>
            <Input
              value={uploadPath}
              onChange={(e) => setUploadPath(e.target.value)}
              placeholder="e.g., assets/test-uploads"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auth Token (Optional)
            </label>
            <Input
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="Firebase auth token"
              type="password"
            />
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading... {progress.toFixed(0)}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
          {uploading && <Progress value={progress} className="w-full" />}
        </CardContent>
      </Card>

      {/* Download URL Display */}
      {downloadURL && (
        <Card>
          <CardHeader>
            <CardTitle>3. Download URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-gray-100 rounded-[10px]">
              <code className="text-sm break-all">{downloadURL}</code>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleDownload}
                disabled={downloading}
                variant="outline"
              >
                {downloading ? (
                  <>
                    <Download className="w-4 h-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download File
                  </>
                )}
              </Button>
              <Button onClick={handleCreateDownloadLink} variant="outline">
                <File className="w-4 h-4 mr-2" />
                Create Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Operations */}
      {downloadURL && (
        <Card>
          <CardHeader>
            <CardTitle>4. File Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleGetMetadata}
                variant="outline"
                className="w-full"
              >
                <Info className="w-4 h-4 mr-2" />
                Get Metadata
              </Button>
              <Button
                onClick={handleCheckExists}
                variant="outline"
                className="w-full"
              >
                {fileExists === null ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check Exists
                  </>
                ) : fileExists ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Exists
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                    Not Found
                  </>
                )}
              </Button>
            </div>

            {authToken && (
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete File
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* File Metadata Display */}
      {fileMetadata && (
        <Card>
          <CardHeader>
            <CardTitle>5. File Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-[10px]">
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(fileMetadata, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>1. Select a file</strong> using the file input
          </p>
          <p>
            <strong>2. Set upload path</strong> (e.g., 'assets/test-uploads')
          </p>
          <p>
            <strong>3. Add auth token</strong> if you want to test authenticated
            operations
          </p>
          <p>
            <strong>4. Upload the file</strong> and get the download URL
          </p>
          <p>
            <strong>5. Test operations</strong> like download, metadata, delete
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Note: Make sure your Firebase Storage rules allow the operations
            you're testing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
