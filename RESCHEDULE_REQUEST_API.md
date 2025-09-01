# Reschedule Request API Documentation

## Overview

The Reschedule Request API allows users to request changes to their booking schedules and enables instructors to approve or reject these requests. This system provides a structured workflow for managing schedule changes with proper validation and status tracking.

## Database Schema

### RescheduleRequest Model

```typescript
@Schema({ timestamps: true })
export class RescheduleRequest {
  @Prop({ type: Types.ObjectId, ref: "Attendance", required: true })
  attendanceId!: Types.ObjectId;

  @Prop({ required: true })
  oldStartTime!: Date;

  @Prop({ required: true })
  oldEndTime!: Date;

  @Prop({ required: true })
  newStartTime!: Date;

  @Prop({ required: true })
  newEndTime!: Date;

  @Prop({ required: true })
  reason!: string;

  @Prop({
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  })
  status!: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  instructorId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  requestorId!: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt!: Date;
}
```

## API Endpoints

### 1. Create Reschedule Request

**Endpoint:** `POST /api/academic-services/reschedule`

**Description:** Create a new reschedule request for a booking.

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
  "attendanceId": "507f1f77bcf86cd799439012",
  "oldStartTime": "2025-01-15T09:00:00.000Z",
  "oldEndTime": "2025-01-15T10:00:00.000Z",
  "newStartTime": "2025-01-16T14:00:00.000Z",
  "newEndTime": "2025-01-16T15:00:00.000Z",
  "reason": "Instructor has a conflict",
  "instructorId": "507f1f77bcf86cd799439013",
  "requestorId": "507f1f77bcf86cd799439014"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Reschedule request created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "attendanceId": "507f1f77bcf86cd799439012",
    "oldStartTime": "2025-01-15T09:00:00.000Z",
    "oldEndTime": "2025-01-15T10:00:00.000Z",
    "newStartTime": "2025-01-16T14:00:00.000Z",
    "newEndTime": "2025-01-16T15:00:00.000Z",
    "reason": "Instructor has a conflict",
    "status": "pending",
    "instructorId": "507f1f77bcf86cd799439013",
    "requestorId": "507f1f77bcf86cd799439014",
    "createdAt": "2025-01-14T10:30:00.000Z",
    "updatedAt": "2025-01-14T10:30:00.000Z"
  }
}
```

### 2. Reject Reschedule Request

**Endpoint:** `PUT /api/academic-services/reschedule/{id}/reject`

**Description:** Reject a reschedule request.

**Authentication:** Required (Bearer token)

**Request Body:**

```json
{
  "reason": "Instructor is not available at the requested time"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Reschedule request rejected successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "rejected",
    "updatedAt": "2025-01-14T11:00:00.000Z"
  }
}
```

### 3. Approve Reschedule Request

**Endpoint:** `PUT /api/academic-services/reschedule/{id}/approve`

**Description:** Approve a reschedule request.

**Authentication:** Required (Bearer token)

**Request Body:** Empty

**Response:**

```json
{
  "success": true,
  "message": "Reschedule request approved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "approved",
    "updatedAt": "2025-01-14T11:00:00.000Z"
  }
}
```

### 4. Get Reschedule Request by ID

**Endpoint:** `GET /api/academic-services/reschedule/{id}`

**Description:** Get a specific reschedule request by ID.

**Authentication:** Required (Bearer token)

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "attendanceId": "507f1f77bcf86cd799439012",
    "oldStartTime": "2025-01-15T09:00:00.000Z",
    "oldEndTime": "2025-01-15T10:00:00.000Z",
    "newStartTime": "2025-01-16T14:00:00.000Z",
    "newEndTime": "2025-01-16T15:00:00.000Z",
    "reason": "Instructor has a conflict",
    "status": "pending",
    "instructorId": "507f1f77bcf86cd799439013",
    "requestorId": "507f1f77bcf86cd799439014",
    "createdAt": "2025-01-14T10:30:00.000Z",
    "updatedAt": "2025-01-14T10:30:00.000Z"
  }
}
```

### 5. Get User's Reschedule Requests

**Endpoint:** `GET /api/academic-services/reschedule`

**Description:** Get all reschedule requests for the authenticated user.

**Authentication:** Required (Bearer token)

**Query Parameters:**

- `status` (optional): Filter by status ("pending", "approved", "rejected", "completed")
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "attendanceId": "507f1f77bcf86cd799439012",
        "oldStartTime": "2025-01-15T09:00:00.000Z",
        "oldEndTime": "2025-01-15T10:00:00.000Z",
        "newStartTime": "2025-01-16T14:00:00.000Z",
        "newEndTime": "2025-01-16T15:00:00.000Z",
        "reason": "Instructor has a conflict",
        "status": "pending",
        "instructorId": "507f1f77bcf86cd799439013",
        "requestorId": "507f1f77bcf86cd799439014",
        "createdAt": "2025-01-14T10:30:00.000Z",
        "updatedAt": "2025-01-14T10:30:00.000Z"
      }
    ],
    "totalCount": 1,
    "totalPages": 1
  }
}
```

### 6. Get Instructor's Reschedule Requests

**Endpoint:** `GET /api/academic-services/instructors/{instructorId}/reschedule-requests`

**Description:** Get all reschedule requests for a specific instructor.

**Authentication:** Required (Bearer token)

**Query Parameters:**

- `status` (optional): Filter by status
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:** Same structure as user's reschedule requests

## Frontend Implementation

### TypeScript Types

```typescript
export interface RescheduleRequest {
  _id: string;
  attendanceId: string;
  oldStartTime: Date;
  oldEndTime: Date;
  newStartTime: Date;
  newEndTime: Date;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  instructorId: string;
  requestorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRescheduleRequestData {
  attendanceId: string;
  oldStartTime: string;
  oldEndTime: string;
  newStartTime: string;
  newEndTime: string;
  reason: string;
  instructorId: string;
  requestorId: string;
}
```

### Service Methods

```typescript
// Create reschedule request
static async createRescheduleRequest(
  data: CreateRescheduleRequestData,
  token: string
): Promise<ApiResponse<RescheduleRequestResponse>>

// Reject reschedule request
static async rejectRescheduleRequest(
  rescheduleId: string,
  token: string,
  reason?: string
): Promise<ApiResponse<RescheduleRequestResponse>>

// Approve reschedule request
static async approveRescheduleRequest(
  rescheduleId: string,
  token: string
): Promise<ApiResponse<RescheduleRequestResponse>>
```

### React Components

1. **CreateRescheduleRequestModal**: Modal for creating new reschedule requests
2. **RescheduleRequestActionModal**: Modal for approving/rejecting requests
3. **RescheduleRequestsPage**: Page for viewing and managing all requests

## Business Logic

### Grace Period

- Reschedule requests can only be made within 48 hours of the original booking time
- After 48 hours, the request cannot be modified

### Status Flow

1. **pending**: Initial state when request is created
2. **approved**: Instructor approved the request
3. **rejected**: Instructor rejected the request
4. **completed**: The rescheduled session has been completed

### Permissions

- **Students/Users**: Can create reschedule requests for their own bookings
- **Instructors**: Can approve/reject reschedule requests for their sessions
- **Admins**: Can manage all reschedule requests

## Validation Rules

1. **Time Validation**: New start time must be in the future
2. **Duration Validation**: New duration should match original duration
3. **Availability Check**: Instructor must be available at the new time
4. **Grace Period**: Request must be within 48 hours of original booking
5. **Status Validation**: Only pending requests can be approved/rejected

## Error Handling

Common error responses:

```json
{
  "success": false,
  "message": "Reschedule request not found",
  "error": {
    "code": "NOT_FOUND",
    "message": "Reschedule request with ID 507f1f77bcf86cd799439011 not found"
  }
}
```

```json
{
  "success": false,
  "message": "Cannot modify request outside grace period",
  "error": {
    "code": "GRACE_PERIOD_EXPIRED",
    "message": "Reschedule requests can only be modified within 48 hours of the original booking"
  }
}
```

## Integration Points

1. **Booking System**: Reschedule requests are linked to attendance records
2. **Notification System**: Send notifications when requests are created/updated
3. **Calendar Integration**: Update calendar events when requests are approved
4. **Payment System**: Handle refunds/adjustments if needed

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Users can only access their own requests
3. **Rate Limiting**: Prevent spam requests
4. **Input Validation**: Sanitize all input data
5. **Audit Logging**: Log all request modifications
