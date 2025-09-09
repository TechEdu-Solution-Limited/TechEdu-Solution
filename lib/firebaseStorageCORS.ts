/**
 * Firebase Storage CORS Testing Utilities
 * Test CORS configuration and connectivity
 */

const STORAGE_BUCKET = "techedu-solution.firebasestorage.app";
const BASE_URL = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o`;

/**
 * Test CORS configuration for Firebase Storage
 * @returns Promise<boolean> - True if CORS is properly configured
 */
export const testCORS = async (): Promise<boolean> => {
  try {
    const testPath = "assets/test-cors.txt";
    const testURL = `${BASE_URL}/${encodeURIComponent(testPath)}`;

    const response = await fetch(testURL, {
      method: "HEAD",
      headers: {
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });

    // Check if CORS headers are present
    const corsHeaders = [
      "access-control-allow-origin",
      "access-control-allow-methods",
      "access-control-allow-headers",
    ];

    const hasCORSHeaders = corsHeaders.some((header) =>
      response.headers.has(header)
    );

    return hasCORSHeaders || response.ok;
  } catch (error) {
    console.error("CORS test failed:", error);
    return false;
  }
};

/**
 * Test file upload with CORS
 * @param file - Test file to upload
 * @param path - Storage path
 * @returns Promise<boolean> - True if upload succeeds
 */
export const testUploadCORS = async (
  file: File,
  path: string
): Promise<boolean> => {
  try {
    const uploadURL = `${BASE_URL}?name=${encodeURIComponent(
      `${path}/${file.name}`
    )}`;

    const response = await fetch(uploadURL, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    return response.ok;
  } catch (error) {
    console.error("Upload CORS test failed:", error);
    return false;
  }
};

/**
 * Test file download with CORS
 * @param downloadURL - File download URL
 * @returns Promise<boolean> - True if download succeeds
 */
export const testDownloadCORS = async (
  downloadURL: string
): Promise<boolean> => {
  try {
    const response = await fetch(downloadURL, {
      method: "GET",
    });

    return response.ok;
  } catch (error) {
    console.error("Download CORS test failed:", error);
    return false;
  }
};

/**
 * Get CORS headers from a response
 * @param url - URL to test
 * @returns Promise<Record<string, string>> - CORS headers
 */
export const getCORSHeaders = async (
  url: string
): Promise<Record<string, string>> => {
  try {
    const response = await fetch(url, {
      method: "OPTIONS",
    });

    const corsHeaders: Record<string, string> = {};

    // Extract CORS-related headers
    const corsHeaderNames = [
      "access-control-allow-origin",
      "access-control-allow-methods",
      "access-control-allow-headers",
      "access-control-allow-credentials",
      "access-control-max-age",
    ];

    corsHeaderNames.forEach((headerName) => {
      const value = response.headers.get(headerName);
      if (value) {
        corsHeaders[headerName] = value;
      }
    });

    return corsHeaders;
  } catch (error) {
    console.error("Failed to get CORS headers:", error);
    return {};
  }
};

/**
 * Comprehensive CORS test
 * @returns Promise<CORSTestResult> - Test results
 */
export const runCORSComprehensiveTest = async (): Promise<{
  basicCORS: boolean;
  uploadCORS: boolean;
  downloadCORS: boolean;
  headers: Record<string, string>;
  recommendations: string[];
}> => {
  const results = {
    basicCORS: false,
    uploadCORS: false,
    downloadCORS: false,
    headers: {} as Record<string, string>,
    recommendations: [] as string[],
  };

  try {
    // Test basic CORS
    results.basicCORS = await testCORS();

    // Test upload CORS with a small test file
    const testFile = new File(["test content"], "cors-test.txt", {
      type: "text/plain",
    });
    results.uploadCORS = await testUploadCORS(testFile, "assets/cors-test");

    // Test download CORS
    const testDownloadURL = `${BASE_URL}/assets/cors-test/cors-test.txt?alt=media`;
    results.downloadCORS = await testDownloadCORS(testDownloadURL);

    // Get CORS headers
    results.headers = await getCORSHeaders(
      `${BASE_URL}/assets/cors-test/cors-test.txt`
    );

    // Generate recommendations
    if (!results.basicCORS) {
      results.recommendations.push(
        "Enable CORS for your Firebase Storage bucket"
      );
    }

    if (!results.uploadCORS) {
      results.recommendations.push(
        "Check upload permissions and CORS configuration"
      );
    }

    if (!results.downloadCORS) {
      results.recommendations.push(
        "Verify download URLs and public access settings"
      );
    }

    if (Object.keys(results.headers).length === 0) {
      results.recommendations.push(
        "CORS headers not found - check Firebase Storage configuration"
      );
    }
  } catch (error) {
    console.error("Comprehensive CORS test failed:", error);
    results.recommendations.push(
      "CORS test failed - check network connectivity and Firebase configuration"
    );
  }

  return results;
};

export default {
  testCORS,
  testUploadCORS,
  testDownloadCORS,
  getCORSHeaders,
  runCORSComprehensiveTest,
};
