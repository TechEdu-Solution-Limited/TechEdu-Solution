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
