export interface UserProfile {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  profile: ProfileDetails;
}

export interface ProfileDetails {
  _id: string;
  // Student profile fields
  studentId?: string;
  institutionId?: string;
  academicLevel?: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  gpa?: number;
  academicInterests?: string[];

  // Tech Professional profile fields
  techProfessionalId?: string;
  yearsOfExperience?: number;
  primarySkills?: string[];
  secondarySkills?: string[];
  currentRole?: string;
  desiredRole?: string;
  preferredWorkModel?: string;
  salaryExpectations?: {
    min: number;
    max: number;
    currency: string;
  };
  availabilityStatus?: string;

  // Recruiter profile fields
  recruiterAdminId?: string;
  recruitingName?: string;
  companyId?: string;
  positionAtCompany?: string;
  recruitmentFocusAreas?: string[];
  preferredHiringModel?: string;
  hiringRegions?: string[];

  // Company information
  company?: CompanyDetails;
}

export interface CompanyDetails {
  _id: string;
  name: string;
  type: string;
  rcNumber?: string;
  industry: string;
  size: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  website?: string;
  linkedIn?: string;
  logoUrl?: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  clearProfile: () => void;
}
