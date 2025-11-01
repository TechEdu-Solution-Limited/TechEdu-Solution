import { Currency, Pricing } from "@/lib/constants/pricing";

export interface Booking {
  _id: string;
  userId: string;
  productId: string;
  serviceId: string;
  instructorId?: string;
  scheduledDate: Date;
  endDate?: Date;
  duration: number; // in minutes
  sessionType: "1-on-1" | "group" | "classroom";
  deliveryMode: "online" | "physical" | "hybrid";
  platformRole: string;
  status:
    | "pending"
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "no-show";
  notes?: string;
  requirements?: string[];
  meetingLink?: string;
  classroomId?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
}

export interface BookingRequest {
  serviceId: string;
  instructorId?: string;
  scheduledDate: string;
  duration?: number;
  sessionType: "1-on-1" | "group" | "classroom";
  deliveryMode: "online" | "physical" | "hybrid";
  platformRole: string;
  notes?: string;
  requirements?: string[];
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    bookingId: string;
    scheduledDate: Date;
    instructorName?: string;
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

export interface InstructorAvailability {
  _id: string;
  instructorId: string;
  date: Date;
  timeSlots: {
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    isAvailable: boolean;
    bookingId?: string;
  }[];
  isAvailable: boolean;
  notes?: string;
}

export interface Instructor {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  bio?: string;
  specialization: string[];
  experience: number; // years
  rating?: number;
  totalSessions?: number;
  isActive: boolean;
  availability?: {
    workingDays: string[]; // ["monday", "tuesday", ...]
    workingHours: {
      start: string; // "09:00"
      end: string; // "17:00"
    };
    timezone: string;
  };
  hourlyRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  _id: string;
  title: string;
  description?: string;
  productType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceLevel {
  _id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Booking Interface based on API response
export interface UserBooking {
  _id: string;
  productId:
    | string
    | {
        _id: string;
        service: string;
        productType: string;
        price: number;
        currency: string;
      };
  productType: string;
  instructorId:
    | string
    | {
        _id: string;
        fullName: string;
        email: string;
      };
  bookingPurpose: string;

  // New fields from updated API response structure
  productName?: string;
  pricing?: Partial<Pricing> | null;
  productPrice?: number; // you already set this in mapping
  productCurrency?: Currency; // you already set this in mapping
  discountPercentage?: number;
  instructorName?: string;
  instructorEmail?: string;
  bookingSchedulerFullName?: string;
  scheduleAt?: string; // Legacy field - use scheduledStart instead
  endAt?: string; // Legacy field - use scheduledEnd instead
  scheduledStart?: string; // Actual scheduled start time from Calendly
  scheduledEnd?: string; // Actual scheduled end time from Calendly
  timezone?: string; // Timezone of scheduled session
  minutesPerSession: number;
  durationInMinutes: number;
  numberOfExpectedParticipants: number;
  isClassroom: boolean;
  isSession: boolean;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "refunded" | "free";
  paymentId?: {
    _id: string;
    amount: number;
    status: "pending" | "success" | "failed";
  };
  schedulingStatus:
    | "awaiting-payment"
    | "payment-failed"
    | "eligible-to-schedule"
    | "link-issued"
    | "scheduled"
    | "meeting-created"
    | "canceled"
    | "completed";

  // Calendly integration fields
  calendlyUrl?: string;
  calendlyEventUri?: string;
  calendlyInviteeUri?: string;
  issuedAt?: string;

  // Meeting link from associated classroom/session
  meetingLink?: string;
  bookingUrl?: string;

  userNotes?: string;
  internalNotes?: string;
  attachments?: string[];
  schedulingMeta?: {
    retryCount: number;
    connectCalendlyUrl?: string;
    lastRetryAt?: string;
  };
  cancellation?: {
    isCancelled: boolean;
    reason?: string;
    cancelledBy?: string;
    cancelledAt?: string;
  };
  createdBy: string;
  participantType:
    | "institution"
    | "team"
    | "individual"
    | "recruiter"
    | "visitor";
  platformRole:
    | "student"
    | "individualTechProfessional"
    | "teamTechProfessional"
    | "recruiter"
    | "institution"
    | "admin"
    | "visitor";
  profileId?: string;
  email: string;
  fullName: string;
  participants?: Array<{
    participantType: string;
    platformRole: string;
    profileId?: string;
    email: string;
    fullName: string;
    _id: string;
  }>;
  actualDaysAndTime?: Array<{
    dayOfWeek:
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday"
      | "Sunday";
    startTime: string;
    endTime: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingEditForm {
  bookingPurpose: string;
  scheduleAt: string;
  endAt?: string;
  durationInMinutes: number;
  participantType:
    | "institution"
    | "team"
    | "individual"
    | "recruiter"
    | "visitor";
  numberOfExpectedParticipants?: number;
  userNotes?: string;
  internalNotes?: string;
  schedulingStatus?: string;
  timezone: string;
  isClassroom: boolean;
  actualDaysAndTime?: Array<{
    dayOfWeek:
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday"
      | "Sunday";
    startTime: string;
    endTime: string;
  }>;
  attachments?: string[];
}

export interface RescheduleRequest {
  _id: string;
  attendanceId: string;
  oldStartTime: Date;
  oldEndTime: Date;
  newStartTime: Date;
  newEndTime: Date;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  instructorId: string;
  requestorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RescheduleRequestResponse {
  success: boolean;
  message: string;
  data?: RescheduleRequest;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface CreateRescheduleRequestData {
  attendanceId: string;
  oldStartTime: string;
  oldEndTime: string;
  newStartTime: string;
  newEndTime: string;
  reason: string;
  instructorId: string;
  requestorId: string;
}
