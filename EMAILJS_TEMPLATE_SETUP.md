# Professional EmailJS Template Setup Guide

This guide will help you set up the professional email templates for your TechEdu Solution contact form.

## 📧 Template Files Created

1. **`emailjs-template.html`** - Professional HTML email template
2. **`emailjs-template-plain.txt`** - Plain text fallback template

## 🎨 Template Features

### HTML Template Features:

- ✅ **Professional Design** - Clean, modern layout with TechEdu branding
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Brand Colors** - Uses your brand colors (#0D1140, #011F72)
- ✅ **Interactive Elements** - Clickable email and phone links
- ✅ **Visual Hierarchy** - Clear sections with icons and badges
- ✅ **Conditional Content** - Shows/hides sections based on data availability
- ✅ **Professional Footer** - Complete company information

### Data Fields Included:

- 👤 **Contact Information**: Name, Email, Phone
- 📋 **Inquiry Details**: Subject, Role, Priority
- 💬 **Message Content**: Full message in styled box
- 📎 **Attachments**: File information (if provided)
- 📊 **Submission Details**: Date/time, form source

## 🚀 Setup Instructions

### Step 1: Create EmailJS Template

1. **Log in to EmailJS Dashboard**

   - Go to [emailjs.com](https://www.emailjs.com/) and sign in

2. **Create New Template**

   - Click "Email Templates" → "Create New Template"
   - Give it a name: "TechEdu Contact Form Template"

3. **Copy HTML Template**

   - Open `emailjs-template.html`
   - Copy the entire content
   - Paste it into the EmailJS template editor

4. **Save Template**
   - Click "Save" to create the template
   - Note down your **Template ID**

### Step 2: Update Configuration

1. **Edit `lib/emailjs-config.ts`**
   ```typescript
   export const EMAILJS_CONFIG = {
     SERVICE_ID: "your_service_id_here",
     TEMPLATE_ID: "your_template_id_here", // Use the ID from Step 1
     PUBLIC_KEY: "your_public_key_here",
     // ... rest of config
   };
   ```

### Step 3: Test the Template

1. **Fill out your contact form**
2. **Submit the form**
3. **Check your email** - You should receive a beautifully formatted email

## 🎯 Template Customization

### Colors and Branding

The template uses your brand colors. To customize:

```css
/* Primary brand color */
.header {
  background: linear-gradient(135deg, #0d1140 0%, #011f72 100%);
}

/* Secondary brand color */
.section-title {
  color: #0d1140;
}
```

### Company Information

Update the footer with your actual details:

```html
<strong>TechEdu Solution</strong><br />
📧 info@techedusolution.com | 📞 +44 78 4882 9768<br />
📍 3 Cavendish Court, S Parade, DN11 2DJ, Doncaster<br />
🌐 <a href="https://techedusolution.com">techedusolution.com</a>
```

### Email Subject Line

Set a professional subject line in EmailJS:

```
New Contact Form Submission - {{subject}} from {{user_name}}
```

## 📱 Email Client Compatibility

### Supported Features:

- ✅ **Gmail** - Full HTML support
- ✅ **Outlook** - Full HTML support
- ✅ **Apple Mail** - Full HTML support
- ✅ **Thunderbird** - Full HTML support
- ✅ **Mobile Email Apps** - Responsive design

### Fallback Support:

- 📧 **Plain Text** - Template includes plain text version
- 🔧 **Progressive Enhancement** - Graceful degradation for older clients

## 🔧 Advanced Customization

### Add Custom Fields

To add new fields to the template:

1. **Update the HTML template**:

```html
<div class="field-group">
  <div class="field-label">Custom Field:</div>
  <div class="field-value">{{custom_field}}</div>
</div>
```

2. **Update the form** to include the new field name
3. **Update `lib/emailjs-config.ts`** to document the new variable

### Conditional Sections

The template includes conditional sections:

```html
{{#if user_phone}}
<!-- Phone number section -->
{{else}}
<span style="color: #9ca3af; font-style: italic;">Not provided</span>
{{/if}}
```

### Priority Badges

You can customize priority levels:

```html
<span class="priority-badge">{{priority_level}}</span>
```

## 📊 Template Variables Reference

| Variable          | Description                | Example                        |
| ----------------- | -------------------------- | ------------------------------ |
| `{{user_name}}`   | Full name from form        | "John Doe"                     |
| `{{user_email}}`  | Email address              | "john@example.com"             |
| `{{user_phone}}`  | Phone number (optional)    | "+44 78 4882 9768"             |
| `{{subject}}`     | Inquiry subject            | "Training Inquiry"             |
| `{{user_role}}`   | Contact type               | "Individual Tech Professional" |
| `{{message}}`     | Message content            | "I'm interested in..."         |
| `{{user_file}}`   | File attachment (optional) | "document.pdf"                 |
| `{{submit_date}}` | Submission timestamp       | "15 January 2024, 14:30"       |

## 🎨 Design System

### Color Palette:

- **Primary**: #0D1140 (Dark Blue)
- **Secondary**: #011F72 (Medium Blue)
- **Accent**: #3b82f6 (Light Blue)
- **Success**: #10b981 (Green)
- **Text**: #333333 (Dark Gray)
- **Background**: #f8f9fa (Light Gray)

### Typography:

- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Line Height**: 1.6
- **Responsive**: Scales appropriately on mobile

### Spacing:

- **Container Padding**: 30px
- **Section Margin**: 25px
- **Field Spacing**: 12px

## 🔍 Troubleshooting

### Template Not Rendering:

1. Check that all template variables are correctly named
2. Verify the template is saved and published in EmailJS
3. Test with simple text first, then add HTML

### Styling Issues:

1. Some email clients strip CSS - the template uses inline styles
2. Test in multiple email clients
3. Use the plain text version as fallback

### Missing Data:

1. Verify form field names match template variables
2. Check that required fields are being submitted
3. Add console logging to debug form data

## 📈 Best Practices

### Email Deliverability:

- ✅ Use a professional "From" address
- ✅ Include clear subject lines
- ✅ Provide plain text alternatives
- ✅ Keep file attachments under 10MB

### User Experience:

- ✅ Respond within 24 hours
- ✅ Include clear call-to-action
- ✅ Provide alternative contact methods
- ✅ Use professional language and formatting

### Maintenance:

- ✅ Regularly test the form
- ✅ Monitor email delivery rates
- ✅ Update company information as needed
- ✅ Backup template configurations

## 🎉 Success Metrics

After setup, you should see:

- 📧 Professional-looking emails
- 📱 Responsive design on all devices
- ⚡ Fast email delivery
- 📊 Complete form data capture
- 🎯 Improved customer response rates

## 📞 Support

If you need help with the templates:

- **EmailJS Documentation**: [docs.emailjs.com](https://docs.emailjs.com/)
- **Template Issues**: Check the troubleshooting section above
- **Customization**: Refer to the advanced customization section
- **TechEdu Support**: Contact your development team
