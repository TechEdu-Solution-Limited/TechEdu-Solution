import { useState, useCallback } from "react";
import {
  uploadFileWithFetch,
  downloadFileWithFetch,
  getFileMetadata,
  deleteFileWithFetch,
  createDownloadLink,
  uploadMultipleFiles,
  fileExists,
} from "@/lib/firebaseStorageAPI";
import { toast } from "react-toastify";

interface UseFirebaseStorageFetchOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (url: string, fileName: string) => void;
  onError?: (error: Error) => void;
}

export function useFirebaseStorageFetch({
  onProgress,
  onSuccess,
  onError,
}: UseFirebaseStorageFetchOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Upload single file
  const uploadFile = useCallback(
    async (file: File, path: string, token?: string) => {
      setUploading(true);
      setProgress(0);

      try {
        const downloadURL = await uploadFileWithFetch(file, path, token);

        onSuccess?.(downloadURL, file.name);
        toast.success(`${file.name} uploaded successfully`);

        return downloadURL;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
        throw error;
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onSuccess, onError]
  );

  // Upload multiple files
  const uploadFiles = useCallback(
    async (files: File[], path: string, token?: string) => {
      setUploading(true);
      setProgress(0);

      try {
        const downloadURLs = await uploadMultipleFiles(
          files,
          path,
          (progress) => {
            setProgress(progress);
            onProgress?.(progress);
          }
        );

        onSuccess?.(downloadURLs[0], files[0].name);
        toast.success(`${files.length} files uploaded successfully`);

        return downloadURLs;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        toast.error(`Failed to upload files: ${errorMessage}`);
        throw error;
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onSuccess, onError, onProgress]
  );

  // Download file
  const downloadFile = useCallback(
    async (downloadURL: string, filename?: string, token?: string) => {
      setDownloading(true);

      try {
        const blob = await downloadFileWithFetch(downloadURL, token);

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "download";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("File downloaded successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Download failed";
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        toast.error(`Failed to download file: ${errorMessage}`);
        throw error;
      } finally {
        setDownloading(false);
      }
    },
    [onError]
  );

  // Get file metadata
  const getMetadata = useCallback(
    async (downloadURL: string, token?: string) => {
      try {
        return await getFileMetadata(downloadURL, token);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to get metadata";
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        throw error;
      }
    },
    [onError]
  );

  // Delete file
  const deleteFile = useCallback(
    async (downloadURL: string, token: string) => {
      try {
        await deleteFileWithFetch(downloadURL, token);
        toast.success("File deleted successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Delete failed";
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        toast.error(
          process.env.NEXT_PUBLIC_NODE_ENV === "production"
            ? "Failed to delete file"
            : `Failed to delete file: ${errorMessage}`
        );
        throw error;
      }
    },
    [onError]
  );

  // Check if file exists
  const checkFileExists = useCallback(async (downloadURL: string) => {
    try {
      return await fileExists(downloadURL);
    } catch (error) {
      return false;
    }
  }, []);

  // Create download link (for direct download)
  const createDownload = useCallback(
    (downloadURL: string, filename?: string) => {
      try {
        createDownloadLink(downloadURL, filename);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create download link";
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [onError]
  );

  return {
    uploading,
    downloading,
    progress,
    uploadFile,
    uploadFiles,
    downloadFile,
    getMetadata,
    deleteFile,
    checkFileExists,
    createDownload,
  };
}
