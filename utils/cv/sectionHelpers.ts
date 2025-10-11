/**
 * Shared Section Logic for Classic Template
 *
 * Provides consistent data formatting for both HTML preview and PDF rendering
 */

import { ResumeSection } from "@/types/cv/index";

// utils/cv/sectionHelpers.ts
function scoreToLevel(score: number): string {
  if (score >= 85) return "Expert";
  if (score >= 65) return "Advanced";
  if (score >= 45) return "Intermediate";
  return "Beginner";
}

// Small helper: always return an array from unknown shapes
function toArray<T = any>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const d = data as any;
    if (Array.isArray(d.items)) return d.items as T[];
    if (Array.isArray(d.list)) return d.list as T[];
    if (Array.isArray(d.rows)) return d.rows as T[];
    // Sometimes APIs return a single object – treat as one row
    return [data as T];
  }
  return [];
}

// Normalize bullets: accept string, string[], fallback to e.bullets
function normalizeBullets(e: any): string[] {
  if (Array.isArray(e?.achievements)) return e.achievements.filter(Boolean);
  if (typeof e?.achievements === "string") {
    return e.achievements
      .split(/\r?\n/)
      .map((s: string) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(e?.bullets)) return e.bullets.filter(Boolean);
  if (typeof e?.bullets === "string") {
    return e.bullets
      .split(/\r?\n/)
      .map((s: string) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function formatSectionContent(section: ResumeSection) {
  switch (section.type) {
    // utils/cv/sectionHelpers.ts (inside formatSectionContent)
    case "work-experience": {
      const rows = toArray(section?.data); // <-- no more .map on non-array
      return rows.map((e: any) => ({
        id: e.id,
        title: e.position || e.title || e.jobTitle,
        company: e.company,
        startDate: e.startDate,
        endDate: e.current ? "Present" : e.endDate,
        location: e.location,
        description: e.description, // Quill HTML
        bullets: normalizeBullets(e), // <-- handles string | string[] | undefined
      }));
    }

    case "education":
      return Array.isArray(section.data)
        ? section.data.map((edu: any) => ({
            degree: edu.degree,
            school: edu.institution,
            field: edu.field,
            startDate: edu.startDate,
            endDate: edu.endDate || "Present",
            location: edu.location,
            gpa: edu.gpa,
          }))
        : [];

    case "skills": {
      const raw = Array.isArray(section.data)
        ? section.data
        : Array.isArray((section as any)?.data?.skills)
        ? (section as any).data.skills
        : [];

      return raw
        .map((skill: any) => ({
          name:
            typeof skill?.name === "string"
              ? skill.name
              : String(skill?.name ?? ""),
          level: skill?.level,
          category: skill?.category,
        }))
        .filter((s: any) => s.name && s.name.trim().length > 0); // ✅ drop empties
    }

    case "languages":
      return Array.isArray(section.data)
        ? section.data.map((lang: any) => ({
            name: lang.name,
            level: lang.level,
          }))
        : [];

    case "projects":
      return Array.isArray(section.data)
        ? section.data.map((project: any) => ({
            name: project.name,
            description: project.description,
            url: project.url,
            technologies: project.technologies || [],
            startDate: project.startDate,
            endDate: project.endDate || "Present",
          }))
        : [];

    case "certifications":
      return Array.isArray(section.data)
        ? section.data.map((cert: any) => ({
            name: cert.name,
            issuer: cert.issuer,
            date: cert.date,
            credentialId: cert.credentialId,
          }))
        : [];

    case "awards":
      return Array.isArray(section.data)
        ? section.data.map((award: any) => ({
            title: award.title,
            issuer: award.issuer,
            date: award.date,
            description: award.description,
          }))
        : [];

    case "interests":
      return Array.isArray(section.data)
        ? section.data.map((interest: any) => ({
            name: interest.name,
            description: interest.description,
          }))
        : [];

    case "professional-summary":
      return [
        {
          summary: section.data.summary,
        },
      ];

    case "personal-info":
      return [
        {
          firstName: section.data.firstName,
          lastName: section.data.lastName,
          email: section.data.email,
          phone: section.data.phone,
          location: section.data.location,
          targetedJobTitle: section.data.targetedJobTitle,
          image: section.data.image,
          linkedin: section.data.linkedin,
          github: section.data.github,
          twitter: section.data.twitter,
          instagram: section.data.instagram,
          website: section.data.website,
        },
      ];

    default:
      return section.data;
  }
}

/**
 * Get section display name
 * Prioritizes custom heading from section data, falls back to default mapping
 */
export function getSectionDisplayName(
  sectionType: string,
  section?: ResumeSection
): string {
  // If section has a custom heading, use it
  if (section?.heading) {
    return section.heading;
  }

  // Fallback to default display names
  const displayNames: { [key: string]: string } = {
    "work-experience": "Work Experience",
    education: "Education",
    skills: "Skills",
    languages: "Languages",
    projects: "Projects",
    certifications: "Certifications",
    awards: "Awards",
    interests: "Interests",
    "professional-summary": "Professional Summary",
    "personal-info": "Personal Information",
  };

  return displayNames[sectionType] || sectionType;
}
