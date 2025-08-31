# Job Application Implementation

## Overview

This document explains how the job application system works, particularly focusing on how CVs and cover letters are handled.

## File Upload System

### Supported File Types

- **CVs and Cover Letters**: PDF, DOC, DOCX, TXT
- **Maximum File Size**: 5MB per file
- **Upload Endpoint**: `/api/upload`

### How File Uploads Work

1. **File Selection**: Users can select files from their device
2. **File Validation**:
   - File type validation
   - File size validation (5MB limit)
   - Authentication check
3. **Upload Process**: Files are uploaded to the server via FormData
4. **Response**: Server returns a unique file ID and metadata

### File Upload API Response

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "file_1234567890_abc123def",
    "name": "my_cv.pdf",
    "size": 1024000,
    "type": "application/pdf",
    "uploadType": "cv",
    "uploadedAt": "2024-01-15T10:30:00.000Z",
    "url": "https://example.com/uploads/file_1234567890_abc123def/my_cv.pdf"
  }
}
```

## Application Submission

### Required Fields

- `jobPostId`: The ID of the job being applied for
- `cvId`: The ID of the selected CV (from uploaded files)

### Optional Fields

- `coverLetterId`: The ID of the selected cover letter (from uploaded files)
- `coverLetterContent`: Custom cover letter text (if writing instead of uploading)
- `referralCode`: Referral code if applicable
- `referrerId`: Referrer ID if known

### Application Data Structure

```json
{
  "jobPostId": "60f7c0c2b4d1c72d88f8a111",
  "cvId": "60f7c0c2b4d1c72d88f8a444",
  "coverLetterId": "60f7c0c2b4d1c72d88f8a555",
  "referralCode": "REF123",
  "referrerId": "60f7c0c2b4d1c72d88f8a666"
}
```

## How to Get the Required IDs

### 1. CV ID (`cvId`)

- Upload a CV file using the file upload interface
- The system will automatically assign a unique ID
- This ID is returned in the upload response and stored in state
- The ID is automatically selected when the file is uploaded

### 2. Cover Letter ID (`coverLetterId`)

- Upload a cover letter file using the file upload interface
- Similar to CV, a unique ID is generated and returned
- Users can choose between uploaded files or write custom text

### 3. Referrer ID (`referrerId`)

- This is an optional field for referral tracking
- Users can manually enter the referrer's ID if they know it
- This is typically provided by the person who referred them

## File Management

### Uploaded Files State

The system maintains a list of uploaded files with their metadata:

```typescript
interface UploadedFile {
  id: string; // Unique file identifier
  name: string; // Original filename
  file: File; // File object
  type: "cv" | "coverLetter"; // File category
  uploadedAt: Date; // Upload timestamp
}
```

### File Operations

- **Upload**: Add new files to the system
- **Select**: Choose which file to use for the application
- **Remove**: Delete uploaded files (also clears selection)
- **Auto-selection**: Newly uploaded files are automatically selected

## Security Features

### Authentication

- All file uploads require a valid JWT token
- Token is sent in the Authorization header
- Unauthenticated requests are rejected

### File Validation

- File type whitelist (only allowed formats accepted)
- File size limits (prevents abuse)
- Server-side validation (client-side validation can be bypassed)

## Production Considerations

### File Storage

The current implementation uses mock file storage. In production, you should:

1. **Cloud Storage**: Use AWS S3, Google Cloud Storage, or similar
2. **Database**: Store file metadata in your database
3. **CDN**: Serve files through a CDN for better performance
4. **Backup**: Implement proper backup strategies

### File Processing

Consider implementing:

- **Virus Scanning**: Scan uploaded files for malware
- **File Conversion**: Convert files to standardized formats
- **OCR**: Extract text from scanned documents
- **Compression**: Optimize file sizes

### Monitoring

- **Upload Logs**: Track file upload patterns
- **Error Monitoring**: Monitor failed uploads
- **Storage Usage**: Track storage consumption
- **Performance Metrics**: Monitor upload speeds

## Error Handling

### Common Error Scenarios

1. **Authentication Failed**: User not logged in or token expired
2. **File Too Large**: Exceeds 5MB limit
3. **Invalid File Type**: Unsupported file format
4. **Upload Failed**: Network or server issues
5. **Storage Full**: No space available (production)

### User Feedback

- Clear error messages for each failure scenario
- Progress indicators during upload
- Success confirmations
- Validation feedback before submission

## Testing

### Test Cases

1. **Valid File Uploads**: Test with different file types and sizes
2. **Invalid File Uploads**: Test with unsupported formats and oversized files
3. **Authentication**: Test with valid/invalid tokens
4. **File Selection**: Test file selection and removal
5. **Form Submission**: Test complete application flow

### Test Files

- Small PDF files (< 1MB)
- Large PDF files (4-5MB)
- DOC/DOCX files
- TXT files
- Invalid file types (images, executables)
- Files with special characters in names
