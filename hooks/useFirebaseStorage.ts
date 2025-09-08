import { useState, useCallback } from "react";
import {
  uploadAssetImage,
  uploadAttachment,
  uploadMaterial,
  deleteFileFromFirebase,
  listFilesInFolder,
  getFileMetadata,
  STORAGE_FOLDERS,
  type StorageFolder,
} from "@/lib/firebase";
import { toast } from "react-toastify";

interface UseFirebaseStorageOptions {
  folder: StorageFolder;
  subfolder?: string;
  onSuccess?: (url: string, fileName: string) => void;
  onError?: (error: Error) => void;
}

export function useFirebaseStorage({
  folder,
  subfolder,
  onSuccess,
  onError,
}: UseFirebaseStorageOptions) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<
    Array<{ url: string; name: string; size: number; updated: string }>
  >([]);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        let downloadURL: string;

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

        // Get file metadata
        const metadata = await getFileMetadata(downloadURL);

        const fileData = {
          url: downloadURL,
          name: file.name,
          size: metadata.size,
          updated: metadata.updated,
        };

        setFiles((prev) => [...prev, fileData]);
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
      }
    },
    [folder, subfolder, onSuccess, onError]
  );

  const deleteFile = useCallback(
    async (url: string) => {
      try {
        await deleteFileFromFirebase(url);
        setFiles((prev) => prev.filter((file) => file.url !== url));
        toast.success("File deleted successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Delete failed";
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        toast.error(`Failed to delete file: ${errorMessage}`);
        throw error;
      }
    },
    [onError]
  );

  const loadFiles = useCallback(async () => {
    try {
      const fileList = await listFilesInFolder(folder, subfolder);
      setFiles(fileList);
      return fileList;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load files";
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      toast.error(`Failed to load files: ${errorMessage}`);
      throw error;
    }
  }, [folder, subfolder, onError]);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    uploading,
    files,
    uploadFile,
    deleteFile,
    loadFiles,
    clearFiles,
  };
}
