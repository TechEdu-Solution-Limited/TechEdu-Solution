export interface CartItem {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  category: string;
  productType: string;
  image: string;
  duration: string;
  certificate: boolean;
  status: string;
  level: string;
  requiresBooking?: boolean;

  // Product details for booking
  deliveryMode?: string;
  sessionType?: string;
  isRecurring?: boolean;
  programLength?: number;
  mode?: string;
  durationInMinutes?: number;
  minutesPerSession?: number;
  hasClassroom?: boolean;
  hasSession?: boolean;
  hasAssessment?: boolean;
  hasCertificate?: boolean;
  requiresEnrollment?: boolean;
  isBookableService?: boolean;
  instructorId?: string;
  instructorName?: string;
  virtualPlatform?: string;
  classroomCapacity?: number;
  classroomRequirements?: string[];

  // Booking details for bookable services
  bookingDetails?: {
    fullName: string;
    email: string;
    phone: string;
    preferredDate?: Date;
    preferredTime?: string;
    numberOfParticipants?: number;
    participantType?: string;
    userNotes?: string;
    bookingData?: any;
  };
}
