# EmailJS Setup Guide for Contact Form

This guide will help you set up EmailJS to handle contact form submissions from your TechEdu Solution website.

## Prerequisites

1. **EmailJS Account**: Sign up at [emailjs.com](https://www.emailjs.com/)
2. **Email Service**: You'll need an email service (Gmail, Outlook, etc.)

## Step 1: Install EmailJS Package

```bash
npm install @emailjs/browser
```

## Step 2: Set Up EmailJS Service

1. **Log in to EmailJS Dashboard**

   - Go to [emailjs.com](https://www.emailjs.com/) and sign in

2. **Add Email Service**
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the authentication steps
   - Note down your **Service ID**

## Step 3: Create Email Template

1. **Go to Email Templates**

   - Click "Email Templates" in the left sidebar
   - Click "Create New Template"

2. **Template Content Example**:

```html
Hello, You have received a new contact form submission from TechEdu Solution:
**Contact Details:** - **Name:** {{user_name}} - **Email:** {{user_email}} -
**Phone:** {{user_phone}} - **Subject:** {{subject}} - **Role:** {{user_role}}
**Message:** {{message}} **Form Submission Details:** - Submitted on:
{{submit_date}} - IP Address: {{user_ip}} Best regards, TechEdu Solution Contact
Form
```

3. **Save Template**
   - Give it a name (e.g., "Contact Form Template")
   - Note down your **Template ID**

## Step 4: Get Your Public Key

1. **Go to Account Settings**
   - Click your profile icon → "Account"
   - Find your **Public Key** in the API Keys section

## Step 5: Update Configuration

1. **Edit `lib/emailjs-config.ts`**

   ```typescript
   export const EMAILJS_CONFIG = {
     SERVICE_ID: "your_actual_service_id_here",
     TEMPLATE_ID: "your_actual_template_id_here",
     PUBLIC_KEY: "your_actual_public_key_here",
     // ... rest of config
   };
   ```

2. **Replace the placeholder values** with your actual credentials

## Step 6: Test the Form

1. **Fill out the contact form** on your website
2. **Submit the form** - you should receive an email
3. **Check the browser console** for any errors

## Troubleshooting

### Common Issues:

1. **"Service not found" error**

   - Verify your Service ID is correct
   - Ensure the service is active in EmailJS dashboard

2. **"Template not found" error**

   - Verify your Template ID is correct
   - Ensure the template is published

3. **"Public key invalid" error**

   - Verify your Public Key is correct
   - Check if your account is active

4. **Form submits but no email received**
   - Check your spam folder
   - Verify email service is properly configured
   - Check EmailJS dashboard for delivery status

### Debug Mode:

Enable debug logging by adding this to your component:

```typescript
// Add this before the emailjs.sendForm call
// console.log("EmailJS Config:", EMAILJS_CONFIG);
// console.log("Form Data:", new FormData(formRef.current!));
```

## Security Considerations

1. **Public Key Exposure**: The public key is safe to expose in client-side code
2. **Rate Limiting**: EmailJS has built-in rate limiting to prevent spam
3. **Template Validation**: EmailJS validates template variables server-side

## Advanced Features

### File Attachments:

The current setup includes file upload support. To handle files:

1. **Update your EmailJS template** to include file handling
2. **Consider file size limits** (EmailJS has restrictions)
3. **Handle file validation** on the client side

### Custom Validation:

Add custom validation before submission:

```typescript
// Example: Phone number validation
const phoneRegex = /^(\+44|0)\d{10}$/;
if (!phoneRegex.test(formData.phone)) {
  setSubmitMessage("Please enter a valid UK phone number");
  return;
}
```

### Success/Error Handling:

The form already includes:

- Loading states
- Success messages
- Error handling
- Form reset after successful submission

## Support

- **EmailJS Documentation**: [docs.emailjs.com](https://docs.emailjs.com/)
- **EmailJS Community**: [community.emailjs.com](https://community.emailjs.com/)
- **TechEdu Support**: Contact your development team

## Notes

- **Free Tier Limits**: EmailJS free tier has monthly email limits
- **Upgrade Plans**: Consider upgrading for higher limits and advanced features
- **Backup Plan**: Keep alternative contact methods (phone, WhatsApp) as backup
