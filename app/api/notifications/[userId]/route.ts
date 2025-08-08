import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";
import { getApiRequestWithRefresh } from "@/lib/apiFetch";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = params.userId;

    // Fetch real notifications data from external API
    // You'll need to replace this with your actual notifications endpoint
    const notificationsResponse = await getApiRequestWithRefresh(
      `/api/notifications/${userId}`, // Replace with your actual endpoint
      token
    );

    // If the external API doesn't have this endpoint yet, return empty array
    if (notificationsResponse.status === 404) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const notifications = notificationsResponse.data?.data || [];

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);

    // If external API is not available, return empty array
    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}
