# Database Architecture - Business Website & App Separation

## Overview

Your application already implements a clean separation between business website users and regular app users by using separate collections and data structures.

## Database Collections

### 1. `business_users` Collection

- **Purpose**: Stores business-specific profile data for the business website
- **Key Fields**:
  - `user_id`: Links to Firebase Auth user
  - `business_name`: Business name for the website
  - `contact_email`: Business contact email
  - `bio`: Business description
  - `address`: Business physical address
  - `location`: Business geo-coordinates
  - `notification_*`: Business-specific notification preferences
  - `auth_provider`: How the business user signed in

### 2. `meetups` Collection

- **Purpose**: Stores business meetups/events created through the business website
- **Key Fields**:
  - `creator_type`: Always "business" for business website events
  - `business_id`: Links to the business
  - `business_name`: Business name for display
  - `activity`: Type of meetup activity
  - `location`: Geo-coordinates for map display
  - `category`: Business category (restaurant, fitness, etc.)

## Separation Benefits

### ✅ What's Already Implemented:

1. **Separate Collections**: `business_users` vs regular `users` (in your main app)
2. **Business-Specific Fields**: Business name, contact info, location, business categories
3. **Business Event Types**: Meetups with business-specific requirements
4. **Auth Context Separation**: `businessProfile` separate from regular user profile
5. **Different Notification Preferences**: Business-focused notifications

### ✅ Data Isolation:

- Business website users have their own settings in `business_users`
- Regular app users have their own settings in `users` (main app)
- No data conflicts or mixing between the two

## How It Works

1. **Authentication**:

   - Same Firebase Auth for both business website and main app
   - User can have accounts in both systems with same Firebase user ID

2. **Profile Creation**:

   - Business website: Creates `BusinessUser` in `business_users` collection
   - Main app: Creates regular user profile in `users` collection

3. **Data Access**:
   - Business website only reads/writes to `business_users` and `meetups`
   - Main app only reads/writes to `users` and app-specific collections

## Recommended Enhancements

### 1. Add User Type Indicator

```typescript
// In business_users document
{
  user_id: "firebase_user_id",
  user_type: "business_website", // Clear indicator
  // ... other business fields
}
```

### 2. Add Business-Specific Settings

```typescript
// Additional fields for business_users
{
  business_settings: {
    timezone: "America/Los_Angeles",
    business_hours: {
      monday: { open: "09:00", close: "17:00" },
      // ... other days
    },
    auto_approve_events: true,
    allow_public_events: true,
  }
}
```

### 3. Add Role-Based Access

```typescript
{
  role: "owner" | "manager" | "staff", // For businesses with multiple users
  permissions: ["create_events", "edit_events", "view_analytics"]
}
```

## Security Rules Example

```javascript
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Business users can only access their own business data
    match /business_users/{businessUserId} {
      allow read, write: if request.auth != null
        && resource.data.user_id == request.auth.uid;
    }

    // Business meetups
    match /meetups/{meetupId} {
      allow read: if true; // Public read for discovery
      allow write: if request.auth != null
        && resource.data.creator_id == request.auth.uid;
    }
  }
}
```

## Current Status: ✅ READY

Your database architecture is already properly implemented for business/app separation! The system is ready to use with complete data isolation between business website users and main app users.
