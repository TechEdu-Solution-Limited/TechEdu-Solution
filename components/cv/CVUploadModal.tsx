"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CVRatingResult, cvService } from "@/services/cv/cvServiceOptimized";
import { toast } from "react-toastify";
import { uploadToBackend } from "@/lib/uploads";

/**
 * NOTE: 24-hour auto-deletion
 * We upload under the prefix: attachments/cv-rating/
 * Add a GCS lifecycle rule to delete files after ~24h.
 */

interface CVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>; // parent uses (file as any).__downloadURL
  loading?: boolean; // <- parent sets true while analyzing; false when RatingModal opens
}

type Phase = "idle" | "validating" | "uploading" | "success" | "error";

export default function CVUploadModal({
  isOpen,
  onClose,
  onUpload,
  loading = false,
}: CVUploadModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId(); // 👈 unique id for aria-labelledby
  const descId = useId();

  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [lastFileName, setLastFileName] = useState<string | null>(null);
  // state at top of the page
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false); // <-- used for "analyzing" spinner
  const [ratingOpen, setRatingOpen] = useState(false);
  const [ratingData, setRatingData] = useState<CVRatingResult | null>(null);

  // called by the modal after the file is uploaded to Firebase
  const handleUpload = async (file: File) => {
    try {
      setUploadLoading(true); // show "Analyzing your CV…" spinner in the modal

      const url = (file as any).__downloadURL; // provided by the modal
      const result = await cvService.rateFromUrl(url, false);

      setRatingData(result);
      setRatingOpen(true); // open RatingModal
      setIsUploadOpen(false); // close the upload modal
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to analyze CV. Please try again.");
    } finally {
      setUploadLoading(false); // stop spinner (also harmless if modal already closed)
    }
  };

  // open/close imperatively
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen && !el.open) el.showModal();
    if (!isOpen && el.open) el.close();
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const resetState = () => {
    setPhase("idle");
    setMessage("");
    setProgress(0);
    setDragOver(false);
    setLastFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validate = (file: File) => {
    const allowed = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]);
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size must be less than 10MB.");
    }
    if (file.type && !allowed.has(file.type)) {
      throw new Error("Please upload a PDF, DOC, DOCX, or TXT file.");
    }
  };

  const simulateProgress = (to = 90) => {
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(
          p + Math.max(1, Math.round((Date.now() - start) / 250)),
          to
        );
        if (next >= to) clearInterval(id);
        return next;
      });
    }, 200);
    return () => clearInterval(id);
  };

  const performUpload = async (file: File) => {
    setPhase("validating");
    setMessage("Validating file…");
    setLastFileName(file.name);

    validate(file);

    setPhase("uploading");
    setMessage("Uploading to secure storage…");
    const cancel = simulateProgress(90);

      // Upload to temp prefix for lifecycle cleanup
      const url = await uploadToBackend(
        file,
        "cv-rating"
      );

    cancel();
    setProgress(100);
    setPhase("success");
    setMessage("Upload complete!");

    // Expose URL on the same File instance so parent can read it
    (file as any).__downloadURL = url;

    // 🔴 DO NOT autoclose. Let parent control closing after analysis.
    await onUpload(file);
    // Parent should set `loading=true` immediately, so we show spinner below.
  };

  const handleChosenFile = async (file: File | null) => {
    if (!file || loading) return;
    try {
      await performUpload(file);
    } catch (err: any) {
      console.error(err);
      setPhase("error");
      setMessage(err?.message || "Upload failed. Please try again.");
    }
  };

  // File input
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    void handleChosenFile(e.target.files?.[0] ?? null);

  // DnD
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    void handleChosenFile(e.dataTransfer.files?.[0] ?? null);
  };

  // Spinner should show while: upload/validate OR parent is analyzing
  const showSpinner =
    loading || phase === "uploading" || phase === "validating";
  const busy = showSpinner;

  return (
    <>
      <style jsx global>{`
        dialog.cv-upload-modal::backdrop {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
        }
      `}</style>

      <dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClose={handleClose}
        className={`
    cv-upload-modal
    fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 m-0
    w-[min(92vw,44rem)] max-h-[90vh] overflow-y-auto
    rounded-[10px] border border-gray-200 dark:border-gray-800
    bg-white dark:bg-gray-800 p-0 shadow-2xl
  `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              id={titleId}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Upload Your CV for Free Analysis
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              aria-label="Close"
              disabled={busy}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Upload area */}
          {phase === "idle" && (
            <label
              htmlFor="cv-upload-input"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={[
                "block border-2 border-dashed rounded-[10px] p-8 text-center transition-colors cursor-pointer",
                dragOver
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 hover:border-gray-400",
              ].join(" ")}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drop your CV here or click to browse
              </h3>
              <p className="text-gray-600 mb-4">
                Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
              >
                Choose File
              </Button>
              <input
                ref={inputRef}
                id="cv-upload-input"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                disabled={busy}
                onChange={onInputChange}
              />
            </label>
          )}

          {/* Progress / Status */}
          {phase !== "idle" && (
            <div className="rounded-[10px] border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                {showSpinner ? (
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                ) : phase === "success" ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                )}
              </div>

              <h3
                className={
                  "text-lg font-semibold " +
                  (phase === "error"
                    ? "text-red-600"
                    : showSpinner
                    ? "text-blue-700"
                    : "text-green-700")
                }
              >
                {showSpinner
                  ? phase === "uploading" || phase === "validating"
                    ? message || "Working…"
                    : "Analyzing your CV…"
                  : message || "Done!"}
              </h3>

              {(phase === "uploading" || phase === "validating") && (
                <div className="mt-4">
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-2 bg-blue-600 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {lastFileName && (
                    <p className="text-xs text-gray-500 mt-2">{lastFileName}</p>
                  )}
                </div>
              )}

              {phase === "error" && !busy && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetState}
                  >
                    Try Again
                  </Button>
                  <Button type="button" onClick={handleClose}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Info Section */}
          <div
            id={descId}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-[10px]"
          >
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • Your file is uploaded securely to temporary storage.
                  </li>
                  <li>• We analyze your CV using AI (in the parent flow).</li>
                  <li>
                    • Temporary uploads under{" "}
                    <code>attachments/cv-rating/</code> are auto-deleted by a
                    lifecycle rule after ~24 hours.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={busy}
            >
              Close
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
