import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Step3TeamProfileProps {
  form: any;
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const programmingLanguages = [
  // Software Development
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "TypeScript",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Scala",
  "R",
  "MATLAB",
  "SQL",
  "HTML/CSS",
  "Shell Scripting",
  // Data Analysis & Business Intelligence
  "Python (Data Science)",
  "R (Statistical Analysis)",
  "SQL (Database Querying)",
  "Power Query/M",
  "DAX",
  "VBA",
  // Education & Training
  "Scratch",
  "Blockly",
  "Educational Programming Tools",
  // Administration & Business
  "Excel/Spreadsheet Formulas",
  "Google Apps Script",
  "Automation Scripts",
  // Not Applicable
  "None/Not Applicable",
  "Other",
];

const frameworksAndTools = [
  // Software Development Frameworks
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  "Next.js",
  "Nuxt.js",
  // DevOps & Infrastructure
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Git",
  "AWS",
  "Azure",
  "Google Cloud",
  // Project Management & Collaboration
  "Jira",
  "Trello",
  "Asana",
  "Monday.com",
  "Notion",
  "Slack",
  "Microsoft Teams",
  "Zoom",
  "Basecamp",
  "ClickUp",
  // Design & Creative
  "Figma",
  "Adobe Creative Suite",
  "Canva",
  "Sketch",
  // Data Analysis & Business Intelligence
  "Tableau",
  "Power BI",
  "Google Analytics",
  "Mixpanel",
  "Excel (Advanced)",
  "Google Sheets",
  "SPSS",
  "SAS",
  "Stata",
  "QlikView",
  "Looker",
  "Apache Spark",
  "Hadoop",
  // CRM & Sales
  "Salesforce",
  "HubSpot",
  "Pipedrive",
  "Zoho CRM",
  "Microsoft Dynamics",
  // Education & Learning Management
  "Moodle",
  "Blackboard",
  "Canvas LMS",
  "Google Classroom",
  "Kahoot",
  "Coursera for Business",
  "Udemy Business",
  "LinkedIn Learning",
  // Human Resources Management
  "BambooHR",
  "Workday",
  "ADP",
  "Zenefits",
  "Paycom",
  "Greenhouse",
  "Lever",
  "LinkedIn Recruiter",
  "Indeed Hiring Platform",
  // Business & Administration
  "Microsoft Office 365",
  "Google Workspace",
  "QuickBooks",
  "SAP",
  "Oracle ERP",
  "Microsoft Dynamics 365",
  "Xero",
  "FreshBooks",
  // Communication & Video Conferencing
  "Webex",
  "GoToMeeting",
  "BlueJeans",
  "RingCentral",
  // Other
  "Other",
];

const softSkills = [
  // Communication & Interpersonal
  "Communication",
  "Active Listening",
  "Written Communication",
  "Verbal Communication",
  "Client Relations",
  "Stakeholder Management",
  "Public Speaking",
  "Presentation Skills",
  "Cross-functional Collaboration",
  // Leadership & Management
  "Leadership",
  "Team Leadership",
  "People Management",
  "Mentoring",
  "Coaching",
  "Delegation",
  "Strategic Planning",
  "Change Management",
  // Problem Solving & Analysis
  "Problem Solving",
  "Critical Thinking",
  "Analytical Thinking",
  "Data Analysis",
  "Research Skills",
  "Decision Making",
  "Root Cause Analysis",
  // Project & Process Management
  "Project Management",
  "Time Management",
  "Task Prioritization",
  "Process Improvement",
  "Agile/Scrum Methodology",
  "Risk Management",
  "Quality Assurance",
  // Business & Professional
  "Business Acumen",
  "Financial Literacy",
  "Negotiation",
  "Sales Skills",
  "Customer Service",
  "Relationship Building",
  "Networking",
  // Education & Training
  "Curriculum Development",
  "Instructional Design",
  "Training Delivery",
  "Assessment & Evaluation",
  "Educational Technology",
  // Human Resources
  "Recruitment",
  "Talent Acquisition",
  "Employee Relations",
  "Performance Management",
  "Compensation & Benefits",
  "HR Analytics",
  "Diversity & Inclusion",
  // Administration & Operations
  "Administrative Skills",
  "Documentation",
  "Record Keeping",
  "Compliance",
  "Policy Development",
  "Vendor Management",
  // Personal & Emotional
  "Emotional Intelligence",
  "Empathy",
  "Adaptability",
  "Resilience",
  "Stress Management",
  "Work-Life Balance",
  // Creative & Innovation
  "Creativity",
  "Innovation",
  "Design Thinking",
  "Creative Problem Solving",
  // Team & Collaboration
  "Teamwork",
  "Collaboration",
  "Conflict Resolution",
  "Consensus Building",
  "Cultural Sensitivity",
  // Other
  "Other",
];

const preferredTechStack = [
  // Software Development Stacks
  "MERN Stack",
  "MEAN Stack",
  "LAMP Stack",
  "JAMstack",
  "Serverless",
  "Microservices",
  "Cloud Native",
  "DevOps",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  // Data & Analytics
  "Data Science",
  "Data Analytics",
  "Business Intelligence",
  "Big Data",
  "Data Warehousing",
  "Machine Learning",
  "AI/ML",
  "Predictive Analytics",
  "Statistical Analysis",
  // Cloud & Infrastructure
  "Cloud Computing (AWS/Azure/GCP)",
  "Cloud Migration",
  "Infrastructure as Code",
  "Containerization",
  // Business & Enterprise Solutions
  "Enterprise Software",
  "CRM Systems",
  "ERP Solutions",
  "Digital Transformation",
  "Process Automation",
  "Workflow Automation",
  "Business Process Management",
  "Security & Compliance",
  "E-commerce Platforms",
  // Education Technology
  "Learning Management Systems (LMS)",
  "Educational Technology",
  "E-Learning Platforms",
  "Student Information Systems",
  "Assessment & Testing Platforms",
  "Virtual Classroom Solutions",
  // Human Resources Technology
  "HRIS (Human Resources Information Systems)",
  "Talent Management Systems",
  "Recruitment Technology",
  "Performance Management Systems",
  "Payroll Systems",
  "Benefits Administration",
  // Business Intelligence & Reporting
  "Business Intelligence Platforms",
  "Reporting & Dashboards",
  "Data Visualization",
  "Financial Analytics",
  "HR Analytics",
  // Administration & Operations
  "Office Productivity Suites",
  "Document Management Systems",
  "Project Management Platforms",
  "Collaboration Tools",
  "Communication Platforms",
  // Consulting & Advisory
  "Business Consulting Tools",
  "Financial Planning Software",
  "Risk Management Systems",
  "Compliance Management",
  // Other
  "Other",
];

const experienceLevels = ["Junior", "Mid", "Senior", "Lead"];
const employmentStatuses = ["employed", "freelance", "unemployed", "student"];
const trainingAvailabilityOptions = ["full-time", "weekends", "custom"];

export function Step3TeamProfile({
  form,
  errors,
  handleChange,
}: Step3TeamProfileProps) {
  const handleLocationChange = (field: string, value: string) => {
    // Ensure location object exists
    const currentLocation = form.location || {};

    // Create a synthetic event that properly handles nested objects
    const event = {
      target: {
        name: "location",
        value: {
          ...currentLocation,
          [field]: value,
        },
      },
    } as any;

    console.log("Team location change:", field, value, event.target.value);
    handleChange(event);
  };

  const handleArrayChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    const currentArray = form[field] || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item: string) => item !== value);

    const event = {
      target: {
        name: field,
        value: newArray,
      },
    } as any;
    handleChange(event);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="teamName"
            className="text-sm font-medium text-gray-700"
          >
            Team Name *
          </Label>
          <Input
            id="teamName"
            name="teamName"
            type="text"
            value={form.teamName}
            onChange={handleChange}
            className={`mt-1 ${
              errors.teamName ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter team name"
          />
          {errors.teamName && (
            <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="teamSize"
            className="text-sm font-medium text-gray-700"
          >
            Team Size *
          </Label>
          <Input
            id="teamSize"
            name="teamSize"
            type="number"
            min="1"
            value={form.teamSize}
            onChange={handleChange}
            className={`mt-1 ${
              errors.teamSize ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter team size"
          />
          {errors.teamSize && (
            <p className="text-red-500 text-xs mt-1">{errors.teamSize}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="primarySpecialization"
            className="text-sm font-medium text-gray-700"
          >
            Primary Specialization *
          </Label>
          <Input
            id="primarySpecialization"
            name="primarySpecialization"
            type="text"
            value={form.primarySpecialization}
            onChange={handleChange}
            className={`mt-1 ${
              errors.primarySpecialization ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="e.g., Full Stack Development, Data Science, Business Analysis, Digital Marketing, Project Management"
          />
          {errors.primarySpecialization && (
            <p className="text-red-500 text-xs mt-1">
              {errors.primarySpecialization}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="experienceLevel"
            className="text-sm font-medium text-gray-700"
          >
            Experience Level *
          </Label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.experienceLevel ? "border-red-500" : ""
            }`}
          >
            <option value="">Select experience level</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {errors.experienceLevel && (
            <p className="text-red-500 text-xs mt-1">
              {errors.experienceLevel}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="currentJobTitle"
            className="text-sm font-medium text-gray-700"
          >
            Current Job Title *
          </Label>
          <Input
            id="currentJobTitle"
            name="currentJobTitle"
            type="text"
            value={form.currentJobTitle}
            onChange={handleChange}
            className={`mt-1 ${
              errors.currentJobTitle ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="e.g., Senior Developer, Team Lead"
          />
          {errors.currentJobTitle && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentJobTitle}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="yearsOfExperience"
            className="text-sm font-medium text-gray-700"
          >
            Years of Experience *
          </Label>
          <Input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            min="0"
            value={form.yearsOfExperience}
            onChange={handleChange}
            className={`mt-1 ${
              errors.yearsOfExperience ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="Enter years of experience"
          />
          {errors.yearsOfExperience && (
            <p className="text-red-500 text-xs mt-1">
              {errors.yearsOfExperience}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="industryFocus"
            className="text-sm font-medium text-gray-700"
          >
            Industry Focus *
          </Label>
          <Input
            id="industryFocus"
            name="industryFocus"
            type="text"
            value={form.industryFocus}
            onChange={handleChange}
            className={`mt-1 ${
              errors.industryFocus ? "border-red-500" : "rounded-[10px]"
            }`}
            placeholder="e.g., Fintech, Healthcare, E-commerce, Manufacturing, Consulting, Education, Government, Non-profit"
          />
          {errors.industryFocus && (
            <p className="text-red-500 text-xs mt-1">{errors.industryFocus}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="employmentStatus"
            className="text-sm font-medium text-gray-700"
          >
            Employment Status *
          </Label>
          <select
            id="employmentStatus"
            name="employmentStatus"
            value={form.employmentStatus}
            onChange={handleChange}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.employmentStatus ? "border-red-500" : ""
            }`}
          >
            <option value="">Select employment status</option>
            {employmentStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          {errors.employmentStatus && (
            <p className="text-red-500 text-xs mt-1">
              {errors.employmentStatus}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="resumeUrl"
            className="text-sm font-medium text-gray-700"
          >
            Resume URL
          </Label>
          <Input
            id="resumeUrl"
            name="resumeUrl"
            type="url"
            value={form.resumeUrl}
            onChange={handleChange}
            className="mt-1 rounded-[10px]"
            placeholder="https://yourresume.com"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remoteWorkExperience"
          name="remoteWorkExperience"
          checked={form.remoteWorkExperience}
          onCheckedChange={(checked) => {
            const event = {
              target: {
                name: "remoteWorkExperience",
                type: "checkbox",
                checked: checked as boolean,
              },
            } as any;
            handleChange(event);
          }}
          className="rounded-[5px]"
        />
        <Label htmlFor="remoteWorkExperience" className="text-sm text-gray-700">
          I have remote work experience
        </Label>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Programming Languages & Relevant Technologies * (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {programmingLanguages.map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang}`}
                checked={form.programmingLanguages?.includes(lang) || false}
                onCheckedChange={(checked) =>
                  handleArrayChange(
                    "programmingLanguages",
                    lang,
                    checked as boolean
                  )
                }
                className="rounded-[5px]"
              />
              <Label htmlFor={`lang-${lang}`} className="text-sm text-gray-700">
                {lang}
              </Label>
            </div>
          ))}
        </div>
        {errors.programmingLanguages && (
          <p className="text-red-500 text-xs mt-1">
            {errors.programmingLanguages}
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Frameworks & Tools * (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {frameworksAndTools.map((tool) => (
            <div key={tool} className="flex items-center space-x-2">
              <Checkbox
                id={`tool-${tool}`}
                checked={form.frameworksAndTools?.includes(tool) || false}
                onCheckedChange={(checked) =>
                  handleArrayChange(
                    "frameworksAndTools",
                    tool,
                    checked as boolean
                  )
                }
                className="rounded-[5px]"
              />
              <Label htmlFor={`tool-${tool}`} className="text-sm text-gray-700">
                {tool}
              </Label>
            </div>
          ))}
        </div>
        {errors.frameworksAndTools && (
          <p className="text-red-500 text-xs mt-1">
            {errors.frameworksAndTools}
          </p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Soft Skills * (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {softSkills.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={`skill-${skill}`}
                checked={form.softSkills?.includes(skill) || false}
                onCheckedChange={(checked) =>
                  handleArrayChange("softSkills", skill, checked as boolean)
                }
                className="rounded-[5px]"
              />
              <Label
                htmlFor={`skill-${skill}`}
                className="text-sm text-gray-700"
              >
                {skill}
              </Label>
            </div>
          ))}
        </div>
        {errors.softSkills && (
          <p className="text-red-500 text-xs mt-1">{errors.softSkills}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Preferred Tech Stack * (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {preferredTechStack.map((stack) => (
            <div key={stack} className="flex items-center space-x-2">
              <Checkbox
                id={`stack-${stack}`}
                checked={form.preferredTechStack?.includes(stack) || false}
                onCheckedChange={(checked) =>
                  handleArrayChange(
                    "preferredTechStack",
                    stack,
                    checked as boolean
                  )
                }
                className="rounded-[5px]"
              />
              <Label
                htmlFor={`stack-${stack}`}
                className="text-sm text-gray-700"
              >
                {stack}
              </Label>
            </div>
          ))}
        </div>
        {errors.preferredTechStack && (
          <p className="text-red-500 text-xs mt-1">
            {errors.preferredTechStack}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="trainingAvailability"
          className="text-sm font-medium text-gray-700"
        >
          Training Availability *
        </Label>
        <Select
          value={form.trainingAvailability}
          onValueChange={(value) => {
            const event = {
              target: {
                name: "trainingAvailability",
                value: value,
              },
            } as any;
            handleChange(event);
          }}
        >
          <SelectTrigger
            className={`mt-1 ${
              errors.trainingAvailability ? "border-red-500" : "rounded-[10px]"
            }`}
          >
            <SelectValue placeholder="Select training availability" />
          </SelectTrigger>
          <SelectContent className="rounded-[10px] bg-white">
            {trainingAvailabilityOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.trainingAvailability && (
          <p className="text-red-500 text-xs mt-1">
            {errors.trainingAvailability}
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
        <h4 className="font-medium text-blue-900 mb-2">Team Profile</h4>
        <p className="text-sm text-blue-800">
          This information helps us understand your team's composition and
          technical capabilities. It will be used to match your team with
          appropriate training programs and opportunities.
        </p>
      </div>
    </div>
  );
}
