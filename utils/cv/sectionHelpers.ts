/**
 * Shared Section Logic for Classic Template
 *
 * Provides consistent data formatting for both HTML preview and PDF rendering
 */

import { ResumeSection } from "@/types/cv/index";

// --- helpers ----------------------------------------------------
function scoreToLevel(score: number): string {
  if (score >= 85) return "Expert";
  if (score >= 65) return "Advanced";
  if (score >= 45) return "Intermediate";
  return "Beginner";
}

// make plain text safe HTML (<p>...</p>) so RichHtml/RichPdf can render it
const isHtml = (s?: string) => !!s && /<\/?[a-z][\s\S]*>/i.test(s);
const esc = (s = "") =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const ensureHtml = (s?: string) =>
  !s ? "" : isHtml(s) ? s : `<p>${esc(s)}</p>`;

// Optional exporter if you want to combine desc+achievements elsewhere
export function toExperienceHtml(
  description?: string,
  achievements?: string[] | string
) {
  const ach = Array.isArray(achievements)
    ? achievements
    : typeof achievements === "string"
    ? achievements
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean)
    : [];

  const descHtml = ensureHtml(description);
  const ulHtml = ach.length
    ? `<ul>${ach.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>`
    : "";

  return `${descHtml}${ulHtml}`;
}

export function formatSectionContent(section: ResumeSection) {
  switch (section.type) {
    case "work-experience": {
      const data = Array.isArray(section.data) ? section.data : [];
      return data.map((e: any) => ({
        id: e.id,
        title: e.position || e.title || e.jobTitle,
        jobTitle: e.jobTitle, // kept for places that check this
        company: e.company,
        startDate: e.startDate,
        endDate: e.current ? "Present" : e.endDate,
        current: !!e.current,
        location: e.location,
        // ✅ ensure description is HTML so RichHtml/RichPdf render it
        description: ensureHtml(e.description),
        // ✅ normalize achievements → bullets
        bullets: Array.isArray(e.achievements)
          ? e.achievements
          : Array.isArray(e.bullets)
          ? e.bullets
          : [],
        technologies: Array.isArray(e.technologies) ? e.technologies : [],
      }));
    }

    case "education": {
      const data = Array.isArray(section.data) ? section.data : [];
      return data.map((e: any) => ({
        id: e.id,
        degree: e.degree,
        field: e.field,
        school: e.institution,
        startDate: e.startDate,
        endDate: e.current ? "Present" : e.endDate,
        location: e.location,
        gpa: e.gpa,
        description: ensureHtml(e.description), // safe for Rich components
      }));
    }

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
        .filter((s: any) => s.name && s.name.trim().length > 0);
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
            description: ensureHtml(project.description), // ✅
            url: project.url,
            technologies: Array.isArray(project.technologies)
              ? project.technologies
              : [],
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
            description: ensureHtml(award.description), // ✅
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
          // ✅ summary may be plain text; make it HTML for RichPdf/RichHtml
          summary: ensureHtml(section.data?.summary),
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
      return Array.isArray(section.data) ? section.data : [];
  }
}

/**
 * Display name helper (unchanged)
 */
export function getSectionDisplayName(
  sectionType: string,
  section?: ResumeSection
): string {
  if (section?.heading) return section.heading;

  const displayNames: Record<string, string> = {
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
