import { Timestamp } from "firebase/firestore";

// Business User Profile
export interface BusinessUser {
  user_id: string;
  user_type: "business_website"; // Clear indicator this is from business website
  email: string;
  business_name: string;
  contact_email: string;
  bio: string;
  photo_url: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  created_at: Timestamp;
  updated_at: Timestamp;
  auth_provider: "email" | "google" | "phone";
  // Business-specific notification preferences
  notification_promotion_updates: boolean;
  notification_customer_interactions: boolean;
  notification_marketing_updates: boolean;
  notification_account_alerts: boolean;
  // Optional business settings
  business_settings?: {
    timezone?: string;
    business_hours?: {
      [key: string]: { open: string; close: string };
    };
    auto_approve_events?: boolean;
    allow_public_events?: boolean;
  };
  role?: "owner" | "manager" | "staff";
  permissions?: string[];
}

// Business Event/Meetup
export interface BusinessEvent {
  id?: string;
  // Core Required Fields
  creator_type: "business"; // Must be set to 'business'
  business_id: string; // The unique identifier for the business
  business_name: string; // The name of the business - used for marker labels
  title: string; // The meetup title/name
  activity: string; // The type of activity - used for categorization and filtering
  location: {
    latitude: number;
    longitude: number;
  }; // Geographic coordinates - required for map positioning

  // Important Optional Fields
  image_url?: string; // Business image - used as background in pill-shaped markers
  category?:
    | "restaurant" // 🍽️
    | "fitness" // 💪
    | "bar" // 🍺
    | "cafe" // ☕
    | "entertainment" // 🎭
    | "retail" // 🛍️
    | "service" // 🔧
    | "health" // 🏥
    | "education" // 📚
    | "other"; // Business category - adds emoji icons to markers
  address?: string; // Physical address - displayed in business info widgets
  description?: string; // Meetup description - shown in detail views

  // System fields
  creator_id: string;
  expiration_date: Timestamp;
  is_live: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  views: number;
  clicks: number;

  // Additional optional fields
  image_urls?: string[];
  type?: "promotion" | "meetup";
  place_id?: string;
  formatted_address?: string;
  place_name?: string;
  place_types?: string[];
  location_name?: string;
  price?: number;
  max_attendees?: number;
  duration_hours?: number;
  tags?: string[];
  difficulty_level?: "beginner" | "intermediate" | "advanced";
}

// Remove QR Code Interaction interface entirely

// Analytics Data
export interface AnalyticsData {
  total_events: number;
  total_views: number;
  total_clicks: number;
  revenue_generated: number;
  avg_attendance_rate: number;
  popular_categories: { [key: string]: number };
  monthly_stats: {
    [month: string]: {
      events: number;
      views: number;
      clicks: number;
      revenue: number;
    };
  };
}

// Customer data (simplified for events business)
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  events_attended: number;
  total_spent: number;
  favorite_categories: string[];
  last_visit: Timestamp;
  created_at: Timestamp;
}

// Form types for creating/editing
export interface CreateBusinessEventForm {
  title: string;
  category: BusinessEvent["category"];
  description: string;
  address: string;
  expiration_date: string;
  price: number;
  max_attendees: number;
  duration_hours: number;
  tags: string[];
  difficulty_level: BusinessEvent["difficulty_level"];
  image_url?: string;
  image_urls?: string[];
}

export interface BusinessProfileForm {
  business_name: string;
  contact_email: string;
  bio: string;
  address: string;
  photo_url?: string;
}

export interface NotificationSettings {
  notification_promotion_updates: boolean;
  notification_customer_interactions: boolean;
  notification_marketing_updates: boolean;
  notification_account_alerts: boolean;
}
