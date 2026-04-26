/**
 * Firebase Storage API with CORS handling
 * Ready-to-use fetch functions for uploading and downloading files
 */

import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { safeConsole } from "./console";

// Firebase Storage configuration
const STORAGE_BUCKET = "techedu-solution.firebasestorage.app";
const BASE_URL = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o`;

// CORS headers for fetch requests
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Upload file using Firebase SDK (Recommended)
 * @param file - File to upload
 * @param path - Storage path (e.g., 'assets/profile-images')
 * @returns Promise<string> - Download URL
 */
export const uploadFileWithSDK = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    const metadata = {
      cacheControl: 'public, max-age=31536000'
    };
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    safeConsole.log("File uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    safeConsole.error("Upload error:", error);
    throw new Error(`Failed to upload file: ${error}`);
  }
};

/**
 * Upload file using direct fetch API with CORS handling
 * @param file - File to upload
 * @param path - Storage path (e.g., 'assets/profile-images')
 * @param token - Firebase auth token (optional)
 * @returns Promise<string> - Download URL
 */
export const uploadFileWithFetch = async (
  file: File,
  path: string,
  token?: string
): Promise<string> => {
  try {
    // Encode the path for URL
    const encodedPath = encodeURIComponent(`${path}/${file.name}`);
    const uploadURL = `${BASE_URL}?name=${encodedPath}`;

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": file.type,
      ...CORS_HEADERS,
    };

    // Add auth token if provided
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Upload the file
    const response = await fetch(uploadURL, {
      method: "POST",
      headers,
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodedPath}?alt=media`;

    safeConsole.log("File uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    safeConsole.error("Upload error:", error);
    throw new Error(`Failed to upload file: ${error}`);
  }
};

/**
 * Download file using direct fetch API with CORS handling
 * @param downloadURL - Full download URL from Firebase
 * @param token - Firebase auth token (optional)
 * @returns Promise<Blob> - File blob
 */
export const downloadFileWithFetch = async (
  downloadURL: string,
  token?: string
): Promise<Blob> => {
  try {
    const headers: HeadersInit = {
      ...CORS_HEADERS,
    };

    // Add auth token if provided
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(downloadURL, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Download failed: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    safeConsole.log("File downloaded successfully:", blob.size, "bytes");
    return blob;
  } catch (error) {
    safeConsole.error("Download error:", error);
    throw new Error(`Failed to download file: ${error}`);
  }
};

/**
 * Get file metadata using fetch API
 * @param downloadURL - Full download URL from Firebase
 * @param token - Firebase auth token (optional)
 * @returns Promise<FileMetadata> - File metadata
 */
export const getFileMetadata = async (
  downloadURL: string,
  token?: string
): Promise<{
  name: string;
  size: number;
  contentType: string;
  updated: string;
}> => {
  try {
    // Extract path from download URL
    const url = new URL(downloadURL);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    if (!pathMatch) {
      throw new Error("Invalid download URL");
    }

    const filePath = decodeURIComponent(pathMatch[1]);
    const metadataURL = `${BASE_URL}/${encodeURIComponent(filePath)}`;

    const headers: HeadersInit = {
      ...CORS_HEADERS,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(metadataURL, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Metadata fetch failed: ${response.status} ${response.statusText}`
      );
    }

    const metadata = await response.json();

    return {
      name: metadata.name || filePath.split("/").pop() || "unknown",
      size: metadata.size || 0,
      contentType: metadata.contentType || "application/octet-stream",
      updated: metadata.updated || new Date().toISOString(),
    };
  } catch (error) {
    safeConsole.error("Metadata fetch error:", error);
    throw new Error(`Failed to get file metadata: ${error}`);
  }
};

/**
 * Delete file using Firebase SDK (Recommended)
 * @param downloadURL - Full download URL from Firebase
 */
export const deleteFileWithSDK = async (downloadURL: string): Promise<void> => {
  try {
    // Extract path from download URL
    const url = new URL(downloadURL);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    if (!pathMatch) {
      throw new Error("Invalid download URL");
    }

    const filePath = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, filePath);

    await deleteObject(storageRef);
    safeConsole.log("File deleted successfully:", filePath);
  } catch (error) {
    safeConsole.error("Delete error:", error);
    throw new Error(`Failed to delete file: ${error}`);
  }
};

/**
 * Delete file using direct fetch API
 * @param downloadURL - Full download URL from Firebase
 * @param token - Firebase auth token (required for delete)
 */
export const deleteFileWithFetch = async (
  downloadURL: string,
  token: string
): Promise<void> => {
  try {
    // Extract path from download URL
    const url = new URL(downloadURL);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    if (!pathMatch) {
      throw new Error("Invalid download URL");
    }

    const filePath = decodeURIComponent(pathMatch[1]);
    const deleteURL = `${BASE_URL}/${encodeURIComponent(filePath)}`;

    const response = await fetch(deleteURL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        ...CORS_HEADERS,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Delete failed: ${response.status} ${response.statusText}`
      );
    }

    safeConsole.log("File deleted successfully:", filePath);
  } catch (error) {
    safeConsole.error("Delete error:", error);
    throw new Error(`Failed to delete file: ${error}`);
  }
};

/**
 * Create a download link for a file
 * @param downloadURL - Full download URL from Firebase
 * @param filename - Optional filename for download
 */
export const createDownloadLink = (
  downloadURL: string,
  filename?: string
): void => {
  const link = document.createElement("a");
  link.href = downloadURL;
  link.download = filename || "download";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Upload multiple files with progress tracking
 * @param files - Array of files to upload
 * @param path - Storage path
 * @param onProgress - Progress callback
 * @returns Promise<string[]> - Array of download URLs
 */
export const uploadMultipleFiles = async (
  files: File[],
  path: string,
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  const results: string[] = [];
  const totalFiles = files.length;

  for (let i = 0; i < files.length; i++) {
    try {
      const downloadURL = await uploadFileWithSDK(files[i], path);
      results.push(downloadURL);

      // Update progress
      if (onProgress) {
        onProgress(((i + 1) / totalFiles) * 100);
      }
    } catch (error) {
      safeConsole.error(`Failed to upload file ${files[i].name}:`, error);
      throw error;
    }
  }

  return results;
};

/**
 * Check if a file exists in Firebase Storage
 * @param downloadURL - Full download URL from Firebase
 * @returns Promise<boolean> - True if file exists
 */
export const fileExists = async (downloadURL: string): Promise<boolean> => {
  try {
    const response = await fetch(downloadURL, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Export default functions for easy use
export default {
  uploadFileWithSDK,
  uploadFileWithFetch,
  downloadFileWithFetch,
  getFileMetadata,
  deleteFileWithSDK,
  deleteFileWithFetch,
  createDownloadLink,
  uploadMultipleFiles,
  fileExists,
};
