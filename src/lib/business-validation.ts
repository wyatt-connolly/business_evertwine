// Utility functions for business website data validation and security

import { BusinessUser, BusinessEvent } from "@/types";

/**
 * Validates that a user profile is a business website user
 */
export const isBusinessWebsiteUser = (user: unknown): user is BusinessUser => {
  return (
    typeof user === "object" &&
    user !== null &&
    (user as BusinessUser).user_type === "business_website"
  );
};

/**
 * Validates that an event is a business website event
 */
export const isBusinessWebsiteEvent = (
  event: unknown
): event is BusinessEvent => {
  return (
    typeof event === "object" &&
    event !== null &&
    (event as BusinessEvent).creator_type === "business"
  );
};

/**
 * Sanitizes business user data to ensure it only contains business website fields
 */
export const sanitizeBusinessUserData = (
  userData: Partial<BusinessUser>
): Partial<BusinessUser> => {
  const allowedFields: (keyof BusinessUser)[] = [
    "user_id",
    "user_type",
    "email",
    "business_name",
    "contact_email",
    "bio",
    "photo_url",
    "address",
    "location",
    "created_at",
    "updated_at",
    "auth_provider",
    "notification_promotion_updates",
    "notification_customer_interactions",
    "notification_marketing_updates",
    "notification_account_alerts",
    "business_settings",
    "role",
    "permissions",
  ];

  const sanitized: Partial<BusinessUser> = {};
  allowedFields.forEach((field) => {
    if (userData[field] !== undefined) {
      (sanitized as Record<string, unknown>)[field] = userData[field];
    }
  });

  // Ensure user_type is always set for business website
  if (sanitized.user_type !== "business_website") {
    sanitized.user_type = "business_website";
  }

  return sanitized;
};

/**
 * Default business settings for new business users
 */
export const getDefaultBusinessSettings = () => ({
  timezone: "America/Los_Angeles",
  business_hours: {
    monday: { open: "09:00", close: "17:00" },
    tuesday: { open: "09:00", close: "17:00" },
    wednesday: { open: "09:00", close: "17:00" },
    thursday: { open: "09:00", close: "17:00" },
    friday: { open: "09:00", close: "17:00" },
    saturday: { open: "10:00", close: "16:00" },
    sunday: { open: "closed", close: "closed" },
  },
  auto_approve_events: true,
  allow_public_events: true,
});

/**
 * Collection names - centralized to avoid hardcoding
 */
export const COLLECTIONS = {
  BUSINESS_USERS: "business_users",
  MEETUPS: "meetups",
  // Regular app collections would be different:
  // USERS: "users",
  // EVENTS: "events",
} as const;

/**
 * Validates business event data structure
 */
export const validateBusinessEventData = (
  eventData: Partial<BusinessEvent>
): string[] => {
  const errors: string[] = [];

  // Core required fields
  if (!eventData.business_name) errors.push("Business name is required");
  if (!eventData.title) errors.push("Event title is required");
  if (!eventData.activity) errors.push("Activity type is required");
  if (!eventData.location) errors.push("Location coordinates are required");

  // Ensure creator_type is business
  if (eventData.creator_type !== "business") {
    errors.push("Creator type must be 'business' for business website events");
  }

  return errors;
};
