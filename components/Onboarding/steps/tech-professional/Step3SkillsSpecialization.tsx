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
  // Development & Engineering
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",

  // AI & Machine Learning
  "Machine Learning",
  "Artificial Intelligence",
  "AI Governance",
  "AI Ethics",
  "Natural Language Processing",
  "Computer Vision",
  "Deep Learning",

  // Data & Analytics
  "Data Science",
  "Data Engineering",
  "Data Governance",
  "Data Analytics",
  "Business Intelligence",
  "Data Architecture",

  // Business & Management
  "Business Analyst",
  "Product Manager",
  "Project Manager",
  "Program Manager",
  "Scrum Master",
  "Agile Coach",
  "Technical Product Manager",

  // Compliance & Governance
  "Compliance Officer",
  "Risk Management",
  "Information Security",
  "Privacy Officer",
  "Regulatory Compliance",

  // Design & UX
  "UI/UX Design",
  "Product Design",
  "User Research",

  // Other
  "Other",

  // Add these new ones based on the roles:
  "Quality Assurance",
  "IT Support",
  "Solutions Architecture",
  "Systems Administration",
  "Enterprise Systems",
  "Software Testing",
  "Technical Support",
  "CRM/ERP Systems",
  "Test Automation",
  "Desktop Support",
  "System Integration",
  "Network Administration",
  "Database Administration",
  "Business Intelligence",
  "Data Mining",
  "Predictive Modeling",
  "Data Visualization",
  "API Development",
  "System Architecture",
  "Threat Detection",
  "Security Audits",
  "Cloud Migration",
  "Infrastructure as Code",
  "Performance Optimization",
  "Product Lifecycle Management",
  "Agile Delivery",
  "Market Analysis",
  "User Research",
  "Interface Design",
  "Accessibility",
  "Defect Tracking",
  "Hardware Troubleshooting",
  "Software Troubleshooting",
  "Integration Strategy",
  "Scalability",
  "AI Deployment",
  "NLP",
  "Computer Vision",
  "Server Management",
  "Network Administration",
  "Backlog Grooming",
  "Process Automation",
  "Data Quality",
  "Data Lineage",
  "Data Stewardship",
  "Audit Preparation",
  "Responsible AI",
  "Ethical Frameworks",
  "Regulatory Compliance",
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

  // Other Framework
  "Other Framework",

  // Add these new ones:
  "Test Automation Tools",
  "CRM Systems",
  "ERP Systems",
  "Business Intelligence Tools",
  "Data Mining Tools",
  "Predictive Modeling Tools",
  "Data Visualization Tools",
  "API Testing Tools",
  "Security Testing Tools",
  "Cloud Migration Tools",
  "Infrastructure as Code Tools",
  "Performance Monitoring Tools",
  "Product Management Tools",
  "Agile Tools",
  "Market Analysis Tools",
  "User Research Tools",
  "Design Systems",
  "Accessibility Tools",
  "Defect Tracking Tools",
  "Hardware Diagnostic Tools",
  "Software Diagnostic Tools",
  "Integration Tools",
  "Scalability Tools",
  "AI Deployment Tools",
  "NLP Tools",
  "Computer Vision Tools",
  "Server Management Tools",
  "Network Management Tools",
  "Process Automation Tools",
  "Data Quality Tools",
  "Data Lineage Tools",
  "Data Stewardship Tools",
  "Audit Tools",
  "Ethical AI Tools",
  "Compliance Tools",
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

  // Version Control & Collaboration
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "SVN",

  // Project Management & Collaboration
  "Jira",
  "Confluence",
  "Asana",
  "Trello",
  "Monday.com",
  "Notion",
  "Slack",
  "Microsoft Teams",
  "Zoom",

  // Design & Prototyping
  "Figma",
  "Adobe XD",
  "Sketch",
  "InVision",
  "Miro",
  "Lucidchart",

  // Databases
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "Elasticsearch",
  "Cassandra",
  "Oracle",
  "SQL Server",

  // Monitoring & Analytics
  "Grafana",
  "Prometheus",
  "New Relic",
  "Datadog",
  "Splunk",
  "Google Analytics",
  "Mixpanel",

  // Security & Compliance
  "Nessus",
  "Qualys",
  "Snyk",
  "SonarQube",
  "Vault",
  "Okta",
  "Auth0",

  // Other Tool
  "Other Tool",
];

const softSkillsOptions = [
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teamwork",
  "Time Management",
  "Adaptability",
  "Critical Thinking",
  "Creativity",
  "Emotional Intelligence",
  "Other",

  // Add these new ones:
  "Facilitation",
  "Negotiation",
  "Storytelling with Data",
  "Logical Reasoning",
  "Continuous Learning",
  "Ethical Mindset",
  "Proactiveness",
  "Troubleshooting",
  "Strategic Thinking",
  "Decision-making",
  "Visual Communication",
  "Precision",
  "Patience",
  "Client-facing Skills",
  "Innovation",
  "Experimentation",
  "Focus",
  "Dependability",
  "Multitasking",
  "Documentation",
  "Stakeholder Communication",
  "Prioritization",
  "Client Relationship",
  "Detail-orientation",
  "Training Delivery",
  "Policy Enforcement",
  "Integrity",
  "Policy Knowledge",
  "Ethical Reasoning",
  "Stakeholder Engagement",
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
          Programming Languages
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
