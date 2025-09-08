import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies } from "@/lib/cookies";

import { safeConsole } from "@/lib/console";
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

    // For now, return empty data since the external API doesn't exist yet
    // In a real implementation, you would fetch from your backend
    return NextResponse.json({
      success: true,
      data: {
        status: "completed",
        currentStep: 7,
        completedSteps: 7,
        progressPercentage: 100,
        steps: [],
        stepData: {},
      },
    });
  } catch (error) {
    safeConsole.error("Error fetching onboarding progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding progress" },
      { status: 500 }
    );
  }
}
