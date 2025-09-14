export interface Session {
  _id: string;
  bookingId: {
    _id: string;
    scheduleAt: string | null;
    endAt: string | null;
  };
  productId: {
    _id: string;
    productType: string;
    service: string;
    price: number;
    currency: string;
  };
  productType: string;
  bookingPurpose: string;
  instructorId: {
    _id: string;
    email: string;
    fullName: string;
  };
  scheduleAt: string;
  endAt: string;
  minutesPerSession: number;
  numberOfExpectedParticipants: number;
  meetingLink?: string;
  sessionType: "group" | "1-on-1";
  status: "upcoming" | "confirmed" | "completed" | "cancelled";
  avgRating?: number;
  userNotes?: string;
  internalNotes?: string;
  participants: Array<{
    participantType: string;
    platformRole: string;
    profileId: string;
    email: string;
    fullName: string;
    _id: string;
  }>;
  createdBy: {
    _id: string;
    email: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
  materialUrl?: string | null;
}

export interface SessionRequest {
  bookingId: string;
  startTime?: string;
  meetingLink?: string;
  notes?: string;
}

export interface SessionResponse {
  success: boolean;
  message: string;
  data?: {
    sessionId: string;
    status: string;
    meetingLink?: string;
    classroomDetails?: {
      name: string;
      address: string;
      roomNumber?: string;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface Classroom {
  _id: string;
  name: string;
  type: "physical" | "virtual" | "hybrid";
  capacity: number;
  location?: {
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates?: [number, number]; // [latitude, longitude]
  };
  facilities: string[]; // ["projector", "whiteboard", "computers", "audio-system"]
  virtualPlatform?: "zoom" | "teams" | "google-meet" | "custom";
  meetingLink?: string;
  meetingCredentials?: {
    id?: string;
    password?: string;
  };
  isActive: boolean;
  isAvailable: boolean;
  maintenanceNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassroomAvailability {
  _id: string;
  classroomId: string;
  date: Date;
  timeSlots: {
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    isAvailable: boolean;
    sessionId?: string;
    bookingId?: string;
  }[];
  isAvailable: boolean;
  maintenance?: boolean;
  notes?: string;
}

export interface ClassroomAssignment {
  _id: string;
  sessionId: string;
  classroomId: string;
  assignedBy: string; // instructor or admin ID
  assignedAt: Date;
  notes?: string;
}

export interface VirtualSession {
  _id: string;
  sessionId: string;
  platform: "zoom" | "teams" | "google-meet" | "custom";
  meetingId: string;
  meetingLink: string;
  password?: string;
  hostKey?: string;
  joinUrl: string;
  startUrl: string;
  settings?: {
    waitingRoom: boolean;
    muteOnEntry: boolean;
    autoRecord: boolean;
    allowChat: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionMaterial {
  _id: string;
  sessionId: string;
  title: string;
  description?: string;
  type: "document" | "video" | "presentation" | "link" | "other";
  url: string;
  fileName?: string;
  fileSize?: number;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
