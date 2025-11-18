// lib/uploads.ts

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, ""); 

// Upload to backend (Coolify Nest) via /api/uploads/image
export async function uploadToBackend(
  file: File,
  folder?: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) {
    formData.append("folder", folder); // backend will use this to choose subfolder
  }

  const res = await fetch(`${API_BASE}/api/uploads/image`, {
    method: "POST",
    body: formData,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore parse error, handled below
  }

  if (!res.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Upload failed with status ${res.status}`;
    throw new Error(message);
  }

  // Your backend should return { url: "https://.../uploads/.../file.ext" }
  const url = data?.url || data?.fileUrl || data?.filePath;
  if (!url) {
    throw new Error("Upload succeeded but no URL was returned from server");
  }

  return url as string;
}
