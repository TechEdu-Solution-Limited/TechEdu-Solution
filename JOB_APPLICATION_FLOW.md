# Job Application Flow & Role-Based Access Control

## Overview

This document explains the complete flow for job applications, including authentication, role validation, and user routing.

## User Flow Diagram

```
Guest User (No Account)
         ↓
    Redirect to Registration
         ↓
Role: individualTechProfessional
         ↓
    Complete Registration
         ↓
    Email Verification Required
         ↓
    Verify Email
         ↓
    Login to Get Token
         ↓
    Redirect to Job Application
         ↓
    Apply for Job ✅

Existing User (Wrong Role)
         ↓
    Show Access Denied
         ↓
    Options:
    - Update Profile Role
    - Create New Account
    - Login with Different Account

Existing User (Correct Role)
         ↓
    Login Successfully
         ↓
    Redirect to Job Application
         ↓
    Apply for Job ✅
```

## Detailed Flow Breakdown

### 1. **Guest Users (No Account)**

- **Action**: Try to access job application page
- **System Response**: Redirect to `/register?role=individualTechProfessional&returnUrl=/dashboard/jobs/{jobId}/apply`
- **User Experience**:
  - Sees registration form pre-selected for `individualTechProfessional` role
  - Completes registration and receives email verification
  - Verifies email address
  - Logs in to get authentication token
  - Automatically redirected back to job application
- **Benefits**:
  - Seamless onboarding for new users
  - Ensures correct role selection
  - Maintains user intent (applying for job)
  - Proper email verification flow

### 2. **Existing Users (Wrong Role)**

- **Action**: Try to access job application page
- **System Response**: Show "Access Restricted" page
- **User Experience**:
  - Clear explanation of why access is denied
  - Current role displayed
  - Three action options:
    1. **Update Profile Role**: Go to profile to change current account role
    2. **Create New Account**: Start fresh with correct role
    3. **Login with Existing Account**: Switch to different account
- **Benefits**:
  - Clear path forward for users
  - Multiple solutions for different user preferences
  - Educational about role requirements

### 3. **Existing Users (Correct Role)**

- **Action**: Try to access job application page
- **System Response**: Allow access immediately
- **User Experience**:
  - Direct access to job application form
  - No interruptions or redirects
- **Benefits**:
  - Smooth experience for qualified users
  - No unnecessary authentication steps

## Implementation Details

### Complete Authentication Flow for New Users

The system handles the complete authentication flow for new users who want to apply for jobs:

#### **Step-by-Step Flow:**

1. **Initial Access Attempt**

   - User tries to access job application page
   - System detects no authentication token
   - Redirects to registration with role pre-selection

2. **Registration Process**

   - User fills out registration form
   - Role is pre-selected as `individualTechProfessional`
   - Return URL is preserved for post-authentication redirect

3. **Email Verification**

   - User receives verification email
   - Must verify email before proceeding
   - Verification link contains return URL parameter

4. **Login & Token Generation**

   - After verification, user logs in
   - System generates JWT token
   - Token is stored in secure cookies

5. **Return to Job Application**
   - User is automatically redirected to original job application page
   - Token validation passes
   - Role validation passes
   - Access granted to application form

#### **URL Parameter Flow:**

```
/dashboard/jobs/{jobId}/apply (initial access)
    ↓
/register?role=individualTechProfessional&returnUrl=/dashboard/jobs/{jobId}/apply
    ↓
/verify-email?returnUrl=/dashboard/jobs/{jobId}/apply
    ↓
/login?returnUrl=/dashboard/jobs/{jobId}/apply
    ↓
/dashboard/jobs/{jobId}/apply (with valid token)
```

### How We Determine User Existence

The system uses a multi-layered approach to determine if a user exists:

#### 1. **Token Validation**

- **JWT Token Check**: Verifies if a token exists in cookies
- **Expiration Check**: Decodes JWT to check if token is expired
- **Format Validation**: Ensures token has correct JWT structure

#### 2. **User Data Validation**

- **Role Context Check**: Verifies if user data exists in the `useRole` context
- **Data Integrity**: Ensures user object has required properties
- **Session Consistency**: Checks if token and user data are in sync

#### 3. **User Scenarios**

| Scenario                      | Token Status    | User Data    | Action                           |
| ----------------------------- | --------------- | ------------ | -------------------------------- |
| **Guest User**                | No token        | No data      | Redirect to registration         |
| **Unverified User**           | No token        | No data      | Redirect to email verification   |
| **Expired Token**             | Invalid/expired | No data      | Clear cookies, redirect to login |
| **Valid Token, No Role Data** | Valid           | Missing      | Clear cookies, redirect to login |
| **Wrong Role User**           | Valid           | Wrong role   | Show access denied with options  |
| **Correct Role User**         | Valid           | Correct role | Allow access                     |

### JobApplicationGuard Component

The `JobApplicationGuard` component wraps the job application page and handles:

1. **Token Validation**: Checks if JWT token exists and is not expired
2. **User Existence Check**: Verifies if user data exists in the system
3. **Role Validation**: Ensures user has `individualTechProfessional` role
4. **Smart Routing**: Redirects users to appropriate pages based on their status
5. **User Experience**: Provides clear feedback and action options

### URL Parameters

The system uses URL parameters to maintain user intent:

- `role=individualTechProfessional`: Pre-selects role in registration
- `returnUrl=/dashboard/jobs/{jobId}/apply`: Redirects back after authentication
- `redirect`: Fallback redirect parameter for backward compatibility

### Email Verification Integration

The system integrates with the email verification flow:

- **Registration**: Preserves return URL for post-verification redirect
- **Verification Email**: Contains return URL in verification link
- **Post-Verification**: User is redirected to login with return URL
- **Login Success**: Automatic redirect to original job application page

### Error Handling

Comprehensive error handling for various scenarios:

- **No Token**: Redirect to registration
- **Invalid Role**: Show access denied with options
- **API Errors**: Graceful fallback to registration
- **Network Issues**: Clear error messages

## Security Features

### Role-Based Access Control (RBAC)

- **Strict Role Validation**: Only `individualTechProfessional` can access
- **Server-Side Validation**: Role checks on both client and server
- **Token Validation**: JWT token verification for all requests

### User Session Management

- **Secure Cookies**: HTTP-only, secure cookies for tokens
- **Role Persistence**: Role information stored in context
- **Session Validation**: Regular token validation

## User Experience Benefits

### 1. **Clear User Journey**

- No confusion about what to do next
- Logical progression from guest to applicant
- Multiple paths to success

### 2. **Role Education**

- Users understand why certain roles are required
- Clear explanation of current vs. required roles
- Guidance on how to achieve required role

### 3. **Seamless Onboarding**

- New users can register and apply in one flow
- No lost context or forgotten intentions
- Automatic return to original goal

### 4. **Flexible Solutions**

- Multiple ways to resolve access issues
- Accommodates different user preferences
- No dead ends in the user journey

## Technical Implementation

### Components Used

- `JobApplicationGuard`: Route protection wrapper
- `useRole`: Context hook for user role management
- `getCookie`: Utility for token retrieval
- `getValidToken`: Advanced token validation utility
- `clearAuthCookies`: Cookie cleanup utility
- Next.js router for navigation

### Auth Utilities (`/lib/auth.ts`)

The system includes robust authentication utilities:

#### `validateToken(token: string)`

- Decodes JWT without verification (client-side only)
- Checks token expiration timestamp
- Returns boolean validity status

#### `getValidToken()`

- Retrieves token from cookies
- Validates token format and expiration
- Returns detailed token status object

#### `clearAuthCookies()`

- Removes all authentication-related cookies
- Ensures clean state after token issues
- Prevents authentication conflicts

### State Management

- **Loading States**: Proper loading indicators during checks
- **Error States**: Clear error messages and recovery options
- **User Context**: Persistent user role and authentication state

### Routing Strategy

- **Smart Redirects**: Maintain user intent through redirects
- **Parameter Preservation**: URL parameters for seamless flow
- **Fallback Routes**: Graceful degradation for edge cases

## Future Enhancements

### 1. **Role Upgrade Flow**

- Allow users to upgrade existing accounts
- Streamlined role change process
- Preserve user data during role transition

### 2. **Multi-Role Support**

- Support for users with multiple roles
- Role switching within the same account
- Context-aware role selection

### 3. **Analytics & Insights**

- Track user flow patterns
- Identify common access issues
- Optimize user experience based on data

### 4. **Advanced Authentication**

- Social login integration
- Two-factor authentication
- Biometric authentication options

## Testing Scenarios

### 1. **Guest User Flow**

- Access job application without account
- Verify redirect to registration
- Test role pre-selection
- Complete registration process
- Verify email verification requirement
- Complete email verification
- Login to get authentication token
- Verify return to job application

### 2. **Wrong Role User Flow**

- Login with non-tech-professional account
- Verify access denied message
- Test all three action options
- Verify role update functionality

### 3. **Correct Role User Flow**

- Login with tech-professional account
- Verify immediate access
- Test job application functionality
- Verify no unnecessary redirects

### 4. **Error Scenarios**

- Test with expired tokens
- Test with invalid tokens
- Test network failures
- Test API errors

This implementation provides a robust, user-friendly, and secure job application system that handles all user types appropriately while maintaining a smooth user experience.
