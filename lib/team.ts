export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "declined";
  invitedAt: string;
  joinedAt?: string;

  invitedBy: {
    id: string;
    fullName: string;
  };
}

export interface TeamData {
  teamId: string;
  teamName: string;
  teamSize: number;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  location: {
    country: string;
    state: string;
    city: string;
  };
  preferredTechStack: string[];
  learningGoals: {
    goalType: string;
    priorityAreas: string[];
    trainingTimeline: string;
  };
}
