import React from "react";
import { Input } from "@/components/ui/input";

interface Step3SkillsSpecializationProps {
  form: {
    primarySpecialization: string;
    programmingLanguages: string[];
    frameworksAndTools: string[];
    softSkills: string[];
    preferredTechStack: string;
  };
  errors: { [key: string]: string };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleArrayChange?: (
    fieldName: string,
    value: string,
    checked: boolean
  ) => void;
}

const specializations = [
  // Software Development & Engineering
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "API Development",
  "System Architecture",
  "Solutions Architecture",
  "Software Testing",
  "Test Automation",
  "Quality Assurance",
  "Performance Optimization",
  "Infrastructure as Code",
  "Cloud Migration",
  "System Integration",
  "Scalability",

  // AI & Machine Learning
  "Machine Learning",
  "Artificial Intelligence",
  "AI Governance",
  "AI Ethics",
  "Natural Language Processing",
  "Computer Vision",
  "Deep Learning",
  "AI Deployment",
  "Responsible AI",
  "Ethical Frameworks",

  // Data & Analytics
  "Data Science",
  "Data Engineering",
  "Data Governance",
  "Data Analytics",
  "Business Intelligence",
  "Data Architecture",
  "Data Mining",
  "Predictive Modeling",
  "Data Visualization",
  "Data Quality",
  "Data Lineage",
  "Data Stewardship",

  // Information Technology
  "IT Support",
  "Technical Support",
  "Desktop Support",
  "Systems Administration",
  "Network Administration",
  "Server Management",
  "Database Administration",
  "Enterprise Systems",
  "CRM/ERP Systems",
  "Hardware Troubleshooting",
  "Software Troubleshooting",
  "Threat Detection",
  "Security Audits",
  "Information Security",
  "Network Management",

  // Business & Management
  "Business Analyst",
  "Business Intelligence",
  "Business Consultation",
  "Business Strategy",
  "Market Analysis",
  "Product Manager",
  "Technical Product Manager",
  "Product Lifecycle Management",
  "Project Manager",
  "Program Manager",
  "Scrum Master",
  "Agile Coach",
  "Agile Delivery",
  "Backlog Grooming",
  "Process Automation",
  "Integration Strategy",

  // Education & Training
  "Educational Technology",
  "Learning Management Systems",
  "Curriculum Development",
  "Instructional Design",
  "E-Learning Development",
  "Training & Development",
  "Educational Administration",
  "Academic Technology",
  "Student Information Systems",
  "Training Delivery",

  // Human Resources Management
  "HR Management",
  "Talent Acquisition",
  "Recruitment",
  "Employee Relations",
  "Performance Management",
  "Compensation & Benefits",
  "HRIS Administration",
  "Organizational Development",
  "Training & Development",
  "HR Analytics",
  "Workforce Planning",
  "Employee Engagement",

  // Administration & Operations
  "Administrative Management",
  "Operations Management",
  "Office Administration",
  "Executive Administration",
  "Facilities Management",
  "Records Management",
  "Administrative Support",
  "Process Management",
  "Workflow Management",

  // Compliance & Governance
  "Compliance Officer",
  "Risk Management",
  "Privacy Officer",
  "Regulatory Compliance",
  "Audit Preparation",
  "Policy Enforcement",
  "Policy Knowledge",

  // Design & UX
  "UI/UX Design",
  "Product Design",
  "User Research",
  "Interface Design",
  "Accessibility",
  "Visual Communication",

  // Other
  "Other",
];

const programmingLanguagesOptions = [
  // Programming Languages
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
  "R",
  "MATLAB",
  "Scala",
  "Julia",
  "SQL",
  "NoSQL",
  "VBA",
  "PowerShell",
  "Shell Scripting",
  "HTML/CSS",
  "XML",
  "JSON",
  "YAML",
  "None/Not Applicable",
  "Other",
];

const frameworksLibraries = [
  // Web Development
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

  // AI & ML Frameworks
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Keras",
  "Hugging Face",
  "OpenAI API",
  "LangChain",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",

  // Data Science & Analytics
  "Jupyter",
  "RStudio",
  "Tableau",
  "Power BI",
  "Apache Spark",
  "Apache Kafka",
  "Apache Airflow",
  "Databricks",
  "Snowflake",
  "Qlik",
  "Looker",
  "SAS",
  "SPSS",
  "Excel Advanced Analytics",

  // Business Intelligence & Analytics
  "Business Intelligence Tools",
  "Data Mining Tools",
  "Predictive Modeling Tools",
  "Data Visualization Tools",
  "Market Analysis Tools",
  "Financial Analysis Tools",
  "Reporting Tools",

  // CRM & ERP Systems
  "Salesforce",
  "Microsoft Dynamics",
  "SAP",
  "Oracle ERP",
  "HubSpot",
  "Zoho CRM",
  "Pipedrive",
  "CRM Systems",
  "ERP Systems",

  // Education & Learning Platforms
  "Learning Management Systems (LMS)",
  "Moodle",
  "Canvas",
  "Blackboard",
  "Google Classroom",
  "Coursera for Business",
  "Udemy for Business",
  "Student Information Systems",
  "Educational Assessment Tools",
  "E-Learning Authoring Tools",

  // HR & People Management
  "HRIS Systems",
  "Workday",
  "BambooHR",
  "ADP",
  "Paychex",
  "Greenhouse",
  "Lever",
  "Talent Management Systems",
  "Performance Management Tools",
  "Recruitment Platforms",
  "Applicant Tracking Systems (ATS)",

  // Project & Process Management
  "Product Management Tools",
  "Agile Tools",
  "Process Automation Tools",
  "Workflow Management Tools",
  "Business Process Management (BPM)",

  // Testing & Quality
  "Test Automation Tools",
  "API Testing Tools",
  "Security Testing Tools",
  "Defect Tracking Tools",
  "Quality Assurance Tools",

  // Infrastructure & DevOps
  "Cloud Migration Tools",
  "Infrastructure as Code Tools",
  "Performance Monitoring Tools",
  "Server Management Tools",
  "Network Management Tools",
  "Scalability Tools",
  "CI/CD Tools",

  // Design & UX
  "Design Systems",
  "User Research Tools",
  "Accessibility Tools",
  "Prototyping Tools",

  // Integration & Automation
  "Integration Tools",
  "API Management Tools",
  "Data Integration Tools",
  "ETL Tools",

  // AI & Data Tools
  "AI Deployment Tools",
  "NLP Tools",
  "Computer Vision Tools",
  "Data Quality Tools",
  "Data Lineage Tools",
  "Data Stewardship Tools",

  // Compliance & Governance
  "Audit Tools",
  "Ethical AI Tools",
  "Compliance Tools",
  "Risk Management Tools",
  "Governance Tools",

  // Diagnostic & Support
  "Hardware Diagnostic Tools",
  "Software Diagnostic Tools",
  "IT Service Management Tools",
  "Help Desk Tools",

  // Other
  "Other Framework",
];

const toolsPlatforms = [
  // Cloud & Infrastructure
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Terraform",
  "Ansible",
  "Jenkins",
  "GitLab CI/CD",
  "GitHub Actions",
  "CloudFormation",
  "Pulumi",

  // Version Control & Collaboration
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "SVN",
  "Perforce",

  // Project Management & Collaboration
  "Jira",
  "Confluence",
  "Asana",
  "Trello",
  "Monday.com",
  "Notion",
  "Basecamp",
  "Wrike",
  "Smartsheet",
  "ClickUp",
  "Slack",
  "Microsoft Teams",
  "Zoom",
  "Webex",
  "Google Meet",
  "Microsoft SharePoint",

  // Design & Prototyping
  "Figma",
  "Adobe XD",
  "Sketch",
  "InVision",
  "Miro",
  "Lucidchart",
  "Draw.io",
  "Whimsical",
  "Adobe Creative Suite",
  "Canva Pro",

  // Databases
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "Elasticsearch",
  "Cassandra",
  "Oracle",
  "SQL Server",
  "DynamoDB",
  "Firebase",
  "Supabase",

  // Monitoring & Analytics
  "Grafana",
  "Prometheus",
  "New Relic",
  "Datadog",
  "Splunk",
  "Google Analytics",
  "Mixpanel",
  "Amplitude",
  "Segment",
  "Adobe Analytics",

  // Security & Compliance
  "Nessus",
  "Qualys",
  "Snyk",
  "SonarQube",
  "Vault",
  "Okta",
  "Auth0",
  "1Password",
  "LastPass",
  "CyberArk",

  // Business & Office Tools
  "Microsoft Office 365",
  "Google Workspace",
  "Microsoft Excel",
  "Google Sheets",
  "Microsoft PowerPoint",
  "Google Slides",
  "Microsoft Word",
  "Google Docs",
  "Microsoft Outlook",
  "Gmail",
  "QuickBooks",
  "Sage",
  "Xero",
  "FreshBooks",

  // Education & Training Platforms
  "Moodle",
  "Canvas",
  "Blackboard",
  "Google Classroom",
  "Microsoft Teams for Education",
  "Zoom for Education",
  "Kahoot",
  "Quizlet",
  "Coursera",
  "Udemy",
  "LinkedIn Learning",
  "Pluralsight",
  "Skillsoft",
  "Cornerstone OnDemand",

  // HR & People Management
  "Workday",
  "BambooHR",
  "ADP Workforce Now",
  "Paychex",
  "Greenhouse",
  "Lever",
  "Jobvite",
  "iCIMS",
  "Cornerstone Talent Management",
  "SuccessFactors",
  "15Five",
  "Culture Amp",
  "Glint",
  "Lattice",

  // CRM & Sales
  "Salesforce",
  "Microsoft Dynamics 365",
  "HubSpot",
  "Zoho CRM",
  "Pipedrive",
  "Salesforce Marketing Cloud",
  "Marketo",
  "Pardot",
  "Mailchimp",
  "Constant Contact",

  // Business Intelligence & Reporting
  "Tableau",
  "Power BI",
  "Qlik Sense",
  "Looker",
  "Sisense",
  "Domo",
  "MicroStrategy",
  "Crystal Reports",
  "SSRS",
  "Google Data Studio",

  // Communication & Customer Support
  "Zendesk",
  "Freshdesk",
  "Intercom",
  "Help Scout",
  "LiveChat",
  "Drift",
  "Twilio",
  "SendGrid",
  "Mailgun",

  // Document & Content Management
  "SharePoint",
  "Google Drive",
  "Dropbox",
  "Box",
  "OneDrive",
  "Confluence",
  "Notion",
  "Evernote",
  "OneNote",

  // Other Tool
  "Other Tool",
];

const softSkillsOptions = [
  // Core Communication & Interpersonal
  "Communication",
  "Verbal Communication",
  "Written Communication",
  "Active Listening",
  "Presentation Skills",
  "Public Speaking",
  "Stakeholder Communication",
  "Client-facing Skills",
  "Client Relationship",
  "Cross-functional Collaboration",

  // Leadership & Management
  "Leadership",
  "Team Leadership",
  "Mentoring",
  "Coaching",
  "People Management",
  "Change Management",
  "Conflict Resolution",
  "Influence",
  "Delegation",

  // Problem Solving & Analysis
  "Problem Solving",
  "Critical Thinking",
  "Analytical Thinking",
  "Logical Reasoning",
  "Root Cause Analysis",
  "Troubleshooting",
  "Decision-making",
  "Strategic Thinking",
  "Systems Thinking",

  // Collaboration & Teamwork
  "Teamwork",
  "Collaboration",
  "Cross-functional Teamwork",
  "Facilitation",
  "Meeting Management",
  "Consensus Building",

  // Organization & Productivity
  "Time Management",
  "Prioritization",
  "Multitasking",
  "Project Management",
  "Task Management",
  "Organization",
  "Planning",
  "Detail-orientation",
  "Precision",

  // Adaptability & Learning
  "Adaptability",
  "Flexibility",
  "Resilience",
  "Continuous Learning",
  "Growth Mindset",
  "Openness to Feedback",
  "Curiosity",

  // Creativity & Innovation
  "Creativity",
  "Innovation",
  "Experimentation",
  "Design Thinking",
  "Out-of-the-box Thinking",

  // Emotional & Social Intelligence
  "Emotional Intelligence",
  "Empathy",
  "Self-awareness",
  "Cultural Awareness",
  "Diversity & Inclusion",
  "Interpersonal Skills",

  // Business & Professional
  "Business Acumen",
  "Commercial Awareness",
  "Negotiation",
  "Vendor Management",
  "Budget Management",
  "Resource Management",
  "Stakeholder Engagement",
  "Stakeholder Management",
  "Relationship Building",

  // Data & Technical Communication
  "Storytelling with Data",
  "Data Interpretation",
  "Technical Writing",
  "Documentation",
  "Visual Communication",
  "Report Writing",

  // Work Ethic & Professionalism
  "Work Ethic",
  "Dependability",
  "Reliability",
  "Accountability",
  "Integrity",
  "Professionalism",
  "Discretion",
  "Confidentiality",

  // Service & Support
  "Customer Service",
  "User Support",
  "Help Desk Support",
  "Training Delivery",
  "Knowledge Transfer",
  "Patience",

  // Compliance & Governance
  "Policy Knowledge",
  "Policy Enforcement",
  "Compliance Awareness",
  "Risk Awareness",
  "Ethical Reasoning",
  "Ethical Mindset",
  "Governance Understanding",

  // Proactive & Initiative
  "Proactiveness",
  "Initiative",
  "Self-motivation",
  "Drive",
  "Ambition",

  // Focus & Execution
  "Focus",
  "Attention to Detail",
  "Quality Orientation",
  "Results-oriented",
  "Execution",

  // Other
  "Other",
];

export default function Step3SkillsSpecialization({
  form,
  errors,
  handleChange,
  handleArrayChange,
}: Step3SkillsSpecializationProps) {
  // Ensure arrays are always arrays
  const programmingLanguages = Array.isArray(form.programmingLanguages)
    ? form.programmingLanguages
    : [];
  const frameworksAndTools = Array.isArray(form.frameworksAndTools)
    ? form.frameworksAndTools
    : [];
  const softSkills = Array.isArray(form.softSkills) ? form.softSkills : [];

  const handleCheckboxChange =
    (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (handleArrayChange) {
        // Use the array-specific handler
        handleArrayChange(fieldName, e.target.value, e.target.checked);
      } else {
        // Fallback to regular handler
        handleChange(e);
      }
    };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Primary Specialization *
        </label>
        <select
          name="primarySpecialization"
          value={form.primarySpecialization}
          onChange={handleChange}
          className="w-full border rounded-[10px] p-2"
          required
        >
          <option value="">Select your primary specialization</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
        {errors.primarySpecialization && (
          <p className="text-red-600 text-sm mt-1">
            {errors.primarySpecialization}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Programming Languages (Optional - Select if applicable)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {programmingLanguagesOptions.map((lang) => (
            <label key={lang} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="programmingLanguages"
                value={lang}
                checked={programmingLanguages.includes(lang)}
                onChange={handleCheckboxChange("programmingLanguages")}
              />
              {lang}
            </label>
          ))}
        </div>
        {errors.programmingLanguages && (
          <p className="text-red-600 text-sm mt-1">
            {errors.programmingLanguages}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Frameworks & Tools
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[...frameworksLibraries, ...toolsPlatforms].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="frameworksAndTools"
                value={item}
                checked={frameworksAndTools.includes(item)}
                onChange={handleCheckboxChange("frameworksAndTools")}
              />
              {item}
            </label>
          ))}
        </div>
        {errors.frameworksAndTools && (
          <p className="text-red-600 text-sm mt-1">
            {errors.frameworksAndTools}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Soft Skills</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {softSkillsOptions.map((skill) => (
            <label key={skill} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="softSkills"
                value={skill}
                checked={softSkills.includes(skill)}
                onChange={handleCheckboxChange("softSkills")}
              />
              {skill}
            </label>
          ))}
        </div>
        {errors.softSkills && (
          <p className="text-red-600 text-sm mt-1">{errors.softSkills}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Preferred Tech Stack
        </label>
        <textarea
          name="preferredTechStack"
          value={form.preferredTechStack}
          onChange={handleChange}
          placeholder="Describe your preferred technology stack or any specific technologies you'd like to work with..."
          className="w-full border rounded-[10px] p-2 h-20"
        />
        {errors.preferredTechStack && (
          <p className="text-red-600 text-sm mt-1">
            {errors.preferredTechStack}
          </p>
        )}
      </div>
    </div>
  );
}
