const fs = require('fs');
const path = require('path');

const pages = [
  // Student
  'student',
  'profile-progress',
  'service-access',
  'booked-services',
  'upload-documents',
  'track-review',
  'learning-goals',
  'cv-builder',
  'announcements',
  'mentors',
  'notifications',
  'support',
  'resources',
  'orders',
  // Individual Tech Professional
  'tech-professional',
  'skill-graph',
  'career-snapshot',
  'training',
  'certifications',
  'profile',
  'courses',
  'cv-builder',
  'cv-builder/ai-suggestions',
  'cv-builder/final',
  'jobs',
  'applications',
  'recommendations',
  'career-tools',
  'cv-analysis',
  'match-score',
  'ai-tips',
  'notifications',
  'notifications/recruiters',
  'notifications/instructors',
  'resources',
  'orders',
  'support',
  // Recruiter
  'recruiter',
  'posted-jobs',
  'jobs-management/new',
  'applications',
  'interviews',
  'interviews/calendar',
  'cv-matching',
  'notes-feedback',
  'profile',
  'notifications',
  'resources',
  'support',
  // Institution
  'institution',
  'onboarding-stats',
  'usage-trends',
  'uploaded-professionals',
  'upload-professionals',
  'students',
  'courses-management',
  'talent-management',
  'bookings',
  'academic-coaching',
  'consulting',
  'institution-reports',
  'verification',
  'upload-docs',
  'instructors',
  'instructors/assign',
  'instructors/reassign',
  'instructors/monitor',
  'notifications',
  'resources',
  'support',
  // Team Tech Professional (member)
  'team-tech-professional',
  'team-tech-professional/my-role',
  'team-tech-professional/company-status',
  'team-tech-professional/tasks',
  'projects',
  'team-tech-professional/communication',
  'training',
  'performance',
  'team-tech-professional/profile',
  'notifications',
  // Team Tech Professional (admin)
  'team-tech-professional/team-management',
  'team-members',
  'team-tech-professional/feedback',
];

const baseDir = path.join(__dirname, '../app/dashboard');

pages.forEach((route) => {
  const pageDir = path.join(baseDir, ...route.split('/'));
  const pageFile = path.join(pageDir, 'page.tsx');
  if (!fs.existsSync(pageFile)) {
    fs.mkdirSync(pageDir, { recursive: true });
    const name = route.split('/').pop().replace(/-/g, ' ');
    const content = `import React from "react";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${name.charAt(0).toUpperCase() + name.slice(1)}</h1>
      <p>This is the ${name} page.</p>
    </div>
  );
}
`;
    fs.writeFileSync(pageFile, content, 'utf8');
    console.log('Created:', pageFile);
  }
}); 