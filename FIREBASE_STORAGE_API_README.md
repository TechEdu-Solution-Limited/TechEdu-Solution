# Firebase Storage API with CORS Handling

Complete fetch-based API for uploading and downloading files from Firebase Storage with proper CORS handling.

## 🚀 Quick Start

### 1. Basic Upload

```typescript
import { uploadFileWithFetch } from "@/lib/firebaseStorageAPI";

const file = new File(["content"], "test.txt", { type: "text/plain" });
const downloadURL = await uploadFileWithFetch(file, "assets/test-uploads");
console.log("File uploaded:", downloadURL);
```

### 2. Basic Download

```typescript
import { downloadFileWithFetch } from "@/lib/firebaseStorageAPI";

const blob = await downloadFileWithFetch(downloadURL);
const url = URL.createObjectURL(blob);
// Use the URL for download or display
```

### 3. Using React Hook

```typescript
import { useFirebaseStorageFetch } from "@/hooks/useFirebaseStorageFetch";

function MyComponent() {
  const { uploadFile, downloadFile, uploading, progress } =
    useFirebaseStorageFetch();

  const handleUpload = async (file: File) => {
    await uploadFile(file, "assets/my-files");
  };

  return (
    <div>
      {uploading && <div>Uploading... {progress}%</div>}
      {/* Your UI */}
    </div>
  );
}
```

## 📁 File Structure

```
lib/
├── firebaseStorageAPI.ts      # Core fetch functions
├── firebaseStorageCORS.ts     # CORS testing utilities
└── firebase.ts               # Firebase SDK functions

hooks/
└── useFirebaseStorageFetch.ts # React hook for easy integration

components/examples/
├── FirebaseUploadExample.tsx     # SDK-based example
└── FirebaseStorageFetchExample.tsx # Fetch-based example
```

## 🔧 API Functions

### Core Upload Functions

- `uploadFileWithSDK()` - Upload using Firebase SDK (recommended)
- `uploadFileWithFetch()` - Upload using fetch API with CORS
- `uploadMultipleFiles()` - Upload multiple files with progress

### Core Download Functions

- `downloadFileWithFetch()` - Download using fetch API
- `createDownloadLink()` - Create direct download link
- `fileExists()` - Check if file exists

### File Management

- `getFileMetadata()` - Get file information
- `deleteFileWithSDK()` - Delete using Firebase SDK
- `deleteFileWithFetch()` - Delete using fetch API

### CORS Testing

- `testCORS()` - Test basic CORS configuration
- `testUploadCORS()` - Test upload CORS
- `testDownloadCORS()` - Test download CORS
- `runCORSComprehensiveTest()` - Run all CORS tests

## 🛡️ CORS Configuration

### Required CORS Headers

```javascript
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
```

### Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /assets/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /attachments/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /materials/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 📝 Usage Examples

### 1. Upload with Authentication

```typescript
const token = await user.getIdToken();
const downloadURL = await uploadFileWithFetch(
  file,
  "attachments/user-uploads",
  token
);
```

### 2. Download with Progress

```typescript
const { downloadFile, downloading, progress } = useFirebaseStorageFetch();

const handleDownload = async () => {
  await downloadFile(downloadURL, "my-file.pdf");
};
```

### 3. Upload Multiple Files

```typescript
const files = [file1, file2, file3];
const downloadURLs = await uploadMultipleFiles(
  files,
  "materials/course-content",
  (progress) => console.log(`Upload progress: ${progress}%`)
);
```

### 4. Check File Exists

```typescript
const exists = await fileExists(downloadURL);
if (exists) {
  console.log("File is available");
}
```

### 5. Get File Metadata

```typescript
const metadata = await getFileMetadata(downloadURL);
console.log("File size:", metadata.size);
console.log("File type:", metadata.contentType);
console.log("Last updated:", metadata.updated);
```

## 🧪 Testing CORS

### Run CORS Test

```typescript
import { runCORSComprehensiveTest } from "@/lib/firebaseStorageCORS";

const results = await runCORSComprehensiveTest();
console.log("CORS Test Results:", results);

if (!results.basicCORS) {
  console.log("CORS not configured properly");
  console.log("Recommendations:", results.recommendations);
}
```

### Test Individual Operations

```typescript
import {
  testCORS,
  testUploadCORS,
  testDownloadCORS,
} from "@/lib/firebaseStorageCORS";

// Test basic CORS
const corsWorking = await testCORS();

// Test upload CORS
const uploadWorking = await testUploadCORS(file, "assets/test");

// Test download CORS
const downloadWorking = await testDownloadCORS(downloadURL);
```

## 🔒 Security Considerations

### 1. Authentication

- Always use Firebase auth tokens for sensitive operations
- Validate user permissions before uploads
- Implement proper file type validation

### 2. File Validation

```typescript
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error("File type not allowed");
}

if (file.size > MAX_SIZE) {
  throw new Error("File too large");
}
```

### 3. Path Security

```typescript
// Sanitize file paths
const sanitizePath = (path: string) => {
  return path.replace(/[^a-zA-Z0-9-_/]/g, "");
};

const safePath = sanitizePath(userInput);
```

## 🚨 Error Handling

### Common Errors

1. **CORS Error**: Check Firebase Storage CORS configuration
2. **Permission Denied**: Verify Firebase Storage rules
3. **File Not Found**: Check if file exists and URL is correct
4. **Network Error**: Check internet connection and Firebase status

### Error Handling Example

```typescript
try {
  const downloadURL = await uploadFileWithFetch(file, path, token);
  console.log("Upload successful:", downloadURL);
} catch (error) {
  if (error.message.includes("CORS")) {
    console.error("CORS configuration issue");
  } else if (error.message.includes("Permission")) {
    console.error("Insufficient permissions");
  } else {
    console.error("Upload failed:", error.message);
  }
}
```

## 📊 Performance Tips

### 1. Use Firebase SDK for Better Performance

```typescript
// Better performance
import { uploadFileWithSDK } from "@/lib/firebaseStorageAPI";
const url = await uploadFileWithSDK(file, path);

// Fallback to fetch API
import { uploadFileWithFetch } from "@/lib/firebaseStorageAPI";
const url = await uploadFileWithFetch(file, path, token);
```

### 2. Implement Progress Tracking

```typescript
const { uploadFile, progress } = useFirebaseStorageFetch({
  onProgress: (progress) => {
    console.log(`Upload progress: ${progress}%`);
  },
});
```

### 3. Batch Operations

```typescript
// Upload multiple files efficiently
const results = await Promise.allSettled(
  files.map((file) => uploadFileWithSDK(file, path))
);
```

## 🔧 Troubleshooting

### CORS Issues

1. Check Firebase Storage CORS configuration
2. Verify domain is allowed in CORS settings
3. Test with CORS testing utilities

### Permission Issues

1. Verify Firebase Storage rules
2. Check user authentication
3. Ensure proper file paths

### Network Issues

1. Check internet connectivity
2. Verify Firebase project status
3. Test with different file sizes

## 📚 Additional Resources

- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [CORS Configuration Guide](https://firebase.google.com/docs/storage/web/download-files)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
