// EmailJS Configuration
// Replace these values with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS service ID (found in EmailJS dashboard)
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,

  // Your EmailJS template ID (found in EmailJS dashboard)
  TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,

  // Your EmailJS public key (found in EmailJS dashboard)
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,

  // EmailJS initialization settings
  INIT_OPTIONS: {
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    // Optional: Block loading of EmailJS SDK from external domain
    blockHeadless: false,
    blockIframe: false,
  },
};

// Template variables mapping
// These should match the variables in your EmailJS template
export const TEMPLATE_VARIABLES = {
  user_name: "user_name", // Full name field
  user_email: "user_email", // Email field
  user_phone: "user_phone", // Phone field
  subject: "subject", // Subject field
  user_role: "user_role", // Role selection
  message: "message", // Message content
  user_file: "user_file", // File attachment
};

// Example EmailJS template structure:
/*
Hello,

You have received a new contact form submission:

Name: {{user_name}}
Email: {{user_email}}
Phone: {{user_phone}}
Subject: {{subject}}
Role: {{user_role}}
Message: {{message}}

Best regards,
TechEdu Solution Contact Form
*/
