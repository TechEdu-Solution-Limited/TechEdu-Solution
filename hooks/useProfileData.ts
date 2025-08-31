import { useProfile } from "@/contexts/ProfileContext";

export const useProfileData = () => {
  const { profile, loading, error, fetchProfile, setProfile, updateProfile } =
    useProfile();

  // Helper function to get profile ID
  const getProfileId = () => {
    return profile?.profile?._id || null;
  };

  // Helper function to get user ID
  const getUserId = () => {
    return profile?._id || null;
  };

  // Helper function to get user role
  const getUserRole = () => {
    return profile?.role || null;
  };

  // Helper function to get company information (for recruiters)
  const getCompanyInfo = () => {
    return profile?.profile?.company || null;
  };

  // Helper function to check if user is a specific role
  const isRole = (role: string) => {
    return profile?.role === role;
  };

  // Helper function to get student-specific data
  const getStudentData = () => {
    if (profile?.role === "student") {
      return {
        studentId: profile.profile.studentId,
        institutionId: profile.profile.institutionId,
        academicLevel: profile.profile.academicLevel,
        fieldOfStudy: profile.profile.fieldOfStudy,
        graduationYear: profile.profile.graduationYear,
        gpa: profile.profile.gpa,
        academicInterests: profile.profile.academicInterests,
      };
    }
    return null;
  };

  // Helper function to get tech professional data
  const getTechProfessionalData = () => {
    if (
      profile?.role === "individualTechProfessional" ||
      profile?.role === "teamTechProfessional"
    ) {
      return {
        techProfessionalId: profile.profile.techProfessionalId,
        yearsOfExperience: profile.profile.yearsOfExperience,
        primarySkills: profile.profile.primarySkills,
        secondarySkills: profile.profile.secondarySkills,
        currentRole: profile.profile.currentRole,
        desiredRole: profile.profile.desiredRole,
        preferredWorkModel: profile.profile.preferredWorkModel,
        salaryExpectations: profile.profile.salaryExpectations,
        availabilityStatus: profile.profile.availabilityStatus,
      };
    }
    return null;
  };

  // Helper function to get recruiter data
  const getRecruiterData = () => {
    if (profile?.role === "recruiter") {
      return {
        recruiterAdminId: profile.profile.recruiterAdminId,
        recruitingName: profile.profile.recruitingName,
        companyId: profile.profile.companyId,
        positionAtCompany: profile.profile.positionAtCompany,
        recruitmentFocusAreas: profile.profile.recruitmentFocusAreas,
        preferredHiringModel: profile.profile.preferredHiringModel,
        hiringRegions: profile.profile.hiringRegions,
        company: profile.profile.company,
      };
    }
    return null;
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    setProfile,
    updateProfile,
    getProfileId,
    getUserId,
    getUserRole,
    getCompanyInfo,
    isRole,
    getStudentData,
    getTechProfessionalData,
    getRecruiterData,
  };
};
