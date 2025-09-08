# Firebase Storage Security Rules Setup

## 🚨 Current Issue

Your current rules are completely locked down:

```javascript
allow read, write: if false;
```

This means **no one can upload or download files**.

## 🔧 Recommended Solution

### Option 1: Simple Production Rules (Recommended for now)

Use `firebase-storage-rules-production.txt`:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Assets - Public read, authenticated write
    match /assets/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Attachments - Authenticated users only
    match /attachments/{allPaths=**} {
      allow read, write: if request.auth != null;
    }

    // Materials - Authenticated users only
    match /materials/{allPaths=**} {
      allow read, write: if request.auth != null;
    }

    // Default - Deny everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 📋 Implementation Steps

### 1. Update Firebase Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `techedu-solution`
3. Go to **Storage** → **Rules**
4. Replace the current rules with the production rules above
5. Click **Publish**

### 2. Test the Rules

```bash
# Test read access to assets (should work)
curl "https://firebasestorage.googleapis.com/v0/b/techedu-solution.appspot.com/o/assets%2Ftest.jpg"

# Test write access (should require authentication)
curl -X POST "https://firebasestorage.googleapis.com/v0/b/techedu-solution.appspot.com/o/assets%2Ftest.jpg"
```

### 3. Verify in Your App

1. Try uploading a file in the cart page
2. Check if files appear in Firebase Storage console
3. Verify files are accessible via download URLs

## 🔒 Security Considerations

### Current Rules Allow:

- ✅ **Assets**: Public read, authenticated write
- ✅ **Attachments**: Authenticated read/write only
- ✅ **Materials**: Authenticated read/write only
- ✅ **Everything else**: Denied

### Future Enhancements:

1. **Role-based access**: Restrict material uploads to admins/instructors
2. **User-specific folders**: Add user ID subfolders for attachments
3. **File size limits**: Add validation rules
4. **File type restrictions**: Allow only specific file types

## 🚀 Advanced Rules (Optional)

If you want more granular control, use `firebase-storage-rules-advanced.txt` which includes:

- Role-based access control
- User-specific folder protection
- Course instructor permissions
- Booking ownership checks

## ⚠️ Important Notes

1. **Authentication Required**: Users must be logged in to upload files
2. **Public Assets**: Images in `/assets/` are publicly accessible
3. **Private Attachments**: Files in `/attachments/` require authentication
4. **Training Materials**: Files in `/materials/` require authentication

## 🧪 Testing Checklist

- [ ] Assets folder allows public read
- [ ] Assets folder allows authenticated write
- [ ] Attachments folder requires authentication
- [ ] Materials folder requires authentication
- [ ] Other paths are denied
- [ ] File upload works in cart page
- [ ] File download URLs work
- [ ] Files appear in Firebase Storage console

## 🔧 Troubleshooting

### "Permission denied" errors:

1. Check if user is authenticated
2. Verify the file path matches the rules
3. Check Firebase Storage console for file existence

### Files not uploading:

1. Verify Firebase configuration in `.env`
2. Check browser console for errors
3. Ensure user is logged in

### Files not accessible:

1. Check if the file path is correct
2. Verify the download URL format
3. Test the URL directly in browser
