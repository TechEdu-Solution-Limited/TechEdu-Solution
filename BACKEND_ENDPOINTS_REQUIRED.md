# Backend Endpoints Required for Real-Time Student Dashboard

## Overview

To enable real-time data fetching for the student dashboard, you need to implement the following endpoints in your external backend API. These endpoints will replace the mock data with live data from your database.

## Required Endpoints

### 1. Student Courses

**Endpoint**: `GET /api/students/{userId}/enrolled-courses`
**Purpose**: Fetch student's enrolled courses with progress tracking
**Authentication**: Required (Bearer token)
**Response Structure**:

```json
{
  "success": true,
  "data": [
    {
      "id": "course_id",
      "name": "Frontend Development",
      "progress": 80,
      "status": "Enrolled", // "Enrolled", "Completed", "Dropped"
      "instructor": "Jane Doe",
      "startDate": "2024-06-01",
      "endDate": "2024-07-01",
      "resumeLink": "/dashboard/courses/1",
      "description": "Learn modern frontend development",
      "modules": [
        {
          "id": 1,
          "name": "HTML & CSS Fundamentals",
          "completed": true
        }
      ]
    }
  ]
}
```

### 2. Student Documents

**Endpoint**: `GET /api/students/{userId}/documents`
**Purpose**: Fetch uploaded documents and their approval status
**Authentication**: Required (Bearer token)
**Response Structure**:

```json
{
  "success": true,
  "data": [
    {
      "id": "doc_id",
      "name": "Transcript.pdf",
      "status": "Approved", // "Approved", "Pending", "Rejected"
      "uploadedAt": "2024-06-01",
      "type": "Transcript",
      "size": "2.3 MB",
      "description": "Official academic transcript",
      "downloadUrl": "/api/documents/1/download",
      "reviewNotes": "Document approved"
    }
  ]
}
```

### 3. Student Services

**Endpoint**: `GET /api/students/{userId}/booked-services`
**Purpose**: Fetch booked services and appointments
**Authentication**: Required (Bearer token)
**Response Structure**:

```json
{
  "success": true,
  "data": [
    {
      "id": "service_id",
      "name": "CV Review",
      "status": "Active", // "Active", "Completed", "Pending", "Cancelled", "Scheduled"
      "type": "Career",
      "bookedAt": "2024-06-15",
      "link": "/dashboard/booked-services",
      "description": "Professional CV review service",
      "advisor": "Sarah Johnson",
      "scheduledDate": "2024-06-25",
      "duration": "60 minutes",
      "price": 75,
      "category": "Career Development",
      "notes": "Focus on technical skills"
    }
  ]
}
```

### 4. Learning Goals

**Endpoint**: `GET /api/students/{userId}/learning-goals`
**Purpose**: Fetch student's learning goals and progress
**Authentication**: Required (Bearer token)
**Response Structure**:

```json
{
  "success": true,
  "data": [
    {
      "id": "goal_id",
      "goal": "Complete React course",
      "progress": 60,
      "deadline": "2024-07-01",
      "category": "Technical Skills",
      "description": "Master React fundamentals",
      "milestones": [
        {
          "id": 1,
          "name": "Complete HTML/CSS modules",
          "completed": true
        }
      ],
      "priority": "High", // "High", "Medium", "Low"
      "status": "In Progress", // "In Progress", "Completed", "Not Started"
      "createdAt": "2024-05-15",
      "updatedAt": "2024-06-20"
    }
  ]
}
```

### 5. Support Tickets

**Endpoint**: `GET /api/students/{userId}/support-tickets`
**Purpose**: Fetch support tickets and their status
**Authentication**: Required (Bearer token)
**Response Structure**:

```json
{
  "success": true,
  "data": [
    {
      "id": "ticket_id",
      "subject": "Issue with course access",
      "status": "Open", // "Open", "Closed", "In Progress"
      "createdAt": "2024-06-10",
      "lastUpdate": "2024-06-12",
      "description": "Unable to access course",
      "priority": "Medium", // "High", "Medium", "Low"
      "category": "Technical Issue",
      "assignedTo": "Support Team",
      "messages": [
        {
          "id": 1,
          "sender": "Student",
          "message": "I'm unable to access the course",
          "timestamp": "2024-06-10T10:30:00Z"
        }
      ]
    }
  ]
}
```

### 6. System Announcements

**Endpoint**: `GET /api/announcements`
**Purpose**: Fetch system-wide announcements
**Authentication**: Required (Bearer token)
**Response Structure**:

```json
{
  "success": true,
  "data": [
    {
      "id": "announcement_id",
      "title": "Welcome to TechEdu!",
      "date": "2024-06-20",
      "content": "Check out the new learning goals feature",
      "type": "feature", // "feature", "update", "course", "reminder", "event", "maintenance"
      "priority": "high", // "high", "medium", "low"
      "category": "Platform Update",
      "read": false,
      "link": "/dashboard/learning-goals",
      "image": "/assets/announcements/learning-goals.jpg"
    }
  ]
}
```

### 7. User Notifications

**Endpoint**: `GET /api/notifications/{userId}`
**Purpose**: Fetch user-specific notifications
**Authentication**: Required (Bearer token)
**Response Structure**:

```json
{
  "success": true,
  "data": [
    {
      "id": "notification_id",
      "type": "offer", // "offer", "tip", "reminder", "alert", "success", "warning"
      "message": "Special discount on new courses!",
      "date": "2024-06-19",
      "read": false,
      "link": "/training/catalog",
      "priority": "medium" // "high", "medium", "low"
    }
  ]
}
```

## Database Schema Suggestions

### Courses Table

```sql
CREATE TABLE student_courses (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  course_id VARCHAR(255) NOT NULL,
  progress INTEGER DEFAULT 0,
  status ENUM('Enrolled', 'Completed', 'Dropped') DEFAULT 'Enrolled',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

### Documents Table

```sql
CREATE TABLE student_documents (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size VARCHAR(50),
  file_type VARCHAR(100),
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  review_notes TEXT,
  FOREIGN KEY (student_id) REFERENCES users(id)
);
```

### Services Table

```sql
CREATE TABLE student_services (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  service_id VARCHAR(255) NOT NULL,
  advisor_id VARCHAR(255),
  status ENUM('Scheduled', 'Active', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scheduled_date TIMESTAMP,
  duration INTEGER, -- in minutes
  price DECIMAL(10,2),
  notes TEXT,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (advisor_id) REFERENCES users(id)
);
```

### Learning Goals Table

```sql
CREATE TABLE student_goals (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  goal TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100),
  progress INTEGER DEFAULT 0,
  deadline DATE,
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);
```

### Support Tickets Table

```sql
CREATE TABLE support_tickets (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Open', 'In Progress', 'Closed') DEFAULT 'Open',
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  category VARCHAR(100),
  assigned_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);
```

### Announcements Table

```sql
CREATE TABLE announcements (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('feature', 'update', 'course', 'reminder', 'event', 'maintenance') DEFAULT 'update',
  priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
  category VARCHAR(100),
  link VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL
);
```

### Notifications Table

```sql
CREATE TABLE user_notifications (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type ENUM('offer', 'tip', 'reminder', 'alert', 'success', 'warning') NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(500),
  priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Implementation Priority

### Phase 1 (High Priority)

1. **Student Courses** - Core functionality for course tracking
2. **Student Documents** - Essential for document management
3. **Student Services** - Important for service bookings

### Phase 2 (Medium Priority)

4. **Learning Goals** - Enhanced learning experience
5. **Support Tickets** - Customer support functionality

### Phase 3 (Low Priority)

6. **System Announcements** - Communication features
7. **User Notifications** - Real-time updates

## Error Handling

All endpoints should handle the following scenarios:

- **404**: Endpoint not found (return empty array)
- **401**: Unauthorized (return error)
- **403**: Forbidden (return error)
- **500**: Server error (return error)

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <access_token>
```

## Response Format

All endpoints should follow this consistent response format:

```json
{
  "success": true,
  "data": [...],
  "message": "Optional message",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## Testing

Test each endpoint with:

1. Valid authentication token
2. Invalid/missing token
3. Non-existent user ID
4. Empty data scenarios
5. Large data sets (pagination)

## Integration Notes

- The frontend will gracefully handle empty arrays if endpoints return 404
- All endpoints use `Promise.allSettled()` to handle partial failures
- The dashboard will show loading states while fetching data
- Error states are handled gracefully with user-friendly messages

This implementation will provide a fully functional real-time student dashboard with live data from your backend database.
