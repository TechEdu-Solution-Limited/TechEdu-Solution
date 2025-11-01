import { Pricing } from "@/lib/constants/pricing";
import { PRODUCT_TYPE_OPTIONS } from "@/lib/constants/productTypes";

export type ProductType = (typeof PRODUCT_TYPE_OPTIONS)[number];

export interface Product {
  _id: string;
  productType: ProductType;

  // Basic Information
  service: string;
  description: string;
  slug: string;

  // Pricing
  price: number;
  currency: string;
  discountPercentage?: number;
  originalPrice?: number;

  pricing?: Partial<Pricing> | null;

  // Visual Assets
  thumbnailUrl?: string;
  iconUrl?: string;
  images?: string[];

  // Categorization (New Structure)
  productCategoryId?:
    | string
    | { _id: string; title: string; productType: string };
  productCategoryTitle?: string;
  productSubCategoryId?:
    | string
    | { _id: string; name: string; productType: string };
  productSubcategoryName?: string;

  // Legacy Structure Support
  category?: string;
  subcategories?: string[];
  difficultyLevel?: string;
  targetAudience?: string[];

  // Delivery & Session Configuration
  deliveryMode: string; // "online" | "physical" | "hybrid"
  sessionType: string; // "1-on-1" | "group" | "classroom"
  programLength: number; // Total duration
  mode: string; // "weeks", "months", "sessions"
  durationInMinutes?: number;
  durationMinutes?: number; // Legacy support
  minutesPerSession?: number;
  totalSessions?: number;

  // Service Features
  hasClassroom: boolean;
  hasSession: boolean;
  hasAssessment: boolean;
  hasCertificate: boolean;
  requiresBooking: boolean;
  requiresEnrollment: boolean;
  isAttachmentRequired?: boolean; // New field to indicate if attachments are required for this product
  isBookableService: boolean;
  isRecurring: boolean;

  // Instructor Information
  instructorId?: string;
  instructorName?: string;
  instructorBio?: string;
  instructorAvatar?: string;

  // Classroom Configuration
  classroomCapacity?: number;
  classroomRequirements?: string[];
  virtualPlatform?: "zoom" | "teams" | "google-meet" | "custom";

  // Content & Materials
  tags: string[];
  materials?: string; // URLs to downloadable materials
  materialUrl?: string; // Alternative URL field for materials
  videoUrl?: string; // Promotional video
  syllabus?: string; // URL to syllabus document
  mediaType?: string; // For Tools: "file", "video", "audio"

  // Status & Availability
  enabled: boolean;
  isActive?: boolean;
  enrollmentOpen?: boolean;
  maxEnrollment?: number;
  currentEnrollment?: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  startDate?: string; // When the program starts
  endDate?: string; // When the program ends

  // Metadata
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
}

// Product Filter Options
export interface ProductFilters {
  productType?: string;
  category?: string;
  deliveryMode?: string;
  sessionType?: string;
  priceRange?: { min: number; max: number };
  hasCertificate?: boolean;
  requiresBooking?: boolean;
}

// Product Sort Options
export interface ProductSort {
  field: "price" | "service" | "category" | "createdAt" | "popularity";
  order: "asc" | "desc";
}

// Product Search Results
export interface ProductSearchResult {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  filters: ProductFilters;
  sort: ProductSort;
}
