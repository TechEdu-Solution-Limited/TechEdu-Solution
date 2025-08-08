import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Fetch real announcements data from external API
    // You'll need to replace this with your actual announcements endpoint
    const announcementsResponse = await getApiRequestWithRefresh(
      "/api/announcements", // Replace with your actual endpoint
      token
    );

    // If the external API doesn't have this endpoint yet, return empty array
    if (announcementsResponse.status === 404) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const announcements = announcementsResponse.data?.data || [];

    return NextResponse.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);

    // If external API is not available, return empty array
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}
