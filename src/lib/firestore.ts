import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  GeoPoint,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BusinessUser, BusinessEvent } from "@/types";

// Business Users Collection
export const businessUsersCollection = collection(db, "business_users");
export const meetupsCollection = collection(db, "meetups");

// Business User Operations
export const createBusinessUser = async (
  userData: Omit<BusinessUser, "created_at" | "updated_at">
) => {
  const now = Timestamp.now();
  const businessUser = {
    ...userData,
    user_type: "business_website" as const, // Ensure this is always set
    created_at: now,
    updated_at: now,
    location: new GeoPoint(
      userData.location.latitude,
      userData.location.longitude
    ),
  };

  const docRef = await addDoc(businessUsersCollection, businessUser);
  return docRef.id;
};

export const getBusinessUser = async (
  userId: string
): Promise<BusinessUser | null> => {
  // Only get business website users
  const q = query(
    businessUsersCollection,
    where("user_id", "==", userId),
    where("user_type", "==", "business_website")
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    ...data,
    location: {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    },
  } as BusinessUser;
};

export const updateBusinessUser = async (
  userId: string,
  updates: Partial<BusinessUser>
) => {
  // Only update business website users
  const q = query(
    businessUsersCollection,
    where("user_id", "==", userId),
    where("user_type", "==", "business_website")
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    const updateData = {
      ...updates,
      updated_at: Timestamp.now(),
    };

    if (updates.location) {
      updateData.location = new GeoPoint(
        updates.location.latitude,
        updates.location.longitude
      );
    }

    await updateDoc(docRef, updateData);
  }
};

// Business Event Operations
export const createBusinessEvent = async (
  eventData: Omit<
    BusinessEvent,
    "id" | "created_at" | "updated_at" | "views" | "clicks"
  >
) => {
  const now = Timestamp.now();
  const businessEvent = {
    ...eventData,
    created_at: now,
    updated_at: now,
    views: 0,
    clicks: 0,
    location: new GeoPoint(
      eventData.location.latitude,
      eventData.location.longitude
    ),
  };

  const docRef = await addDoc(meetupsCollection, businessEvent);
  return docRef.id;
};

export const getBusinessEvents = async (
  businessId: string
): Promise<BusinessEvent[]> => {
  const q = query(
    meetupsCollection,
    where("business_id", "==", businessId),
    where("creator_type", "==", "business"),
    orderBy("created_at", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    location: {
      latitude: doc.data().location.latitude,
      longitude: doc.data().location.longitude,
    },
  })) as BusinessEvent[];
};

export const updateBusinessEvent = async (
  eventId: string,
  updates: Partial<BusinessEvent>
) => {
  const docRef = doc(meetupsCollection, eventId);
  const updateData = {
    ...updates,
    updated_at: Timestamp.now(),
  };

  if (updates.location) {
    updateData.location = new GeoPoint(
      updates.location.latitude,
      updates.location.longitude
    );
  }

  await updateDoc(docRef, updateData);
};

export const deleteBusinessEvent = async (eventId: string) => {
  const docRef = doc(meetupsCollection, eventId);
  await deleteDoc(docRef);
};

export const incrementEventViews = async (eventId: string) => {
  const docRef = doc(meetupsCollection, eventId);
  await updateDoc(docRef, {
    views: increment(1),
  });
};

// Remove all QR Code functionality

// Analytics Operations
export const getBusinessAnalytics = async (businessId: string) => {
  // Get all events for the business
  const events = await getBusinessEvents(businessId);

  // Calculate analytics
  const totalEvents = events.length;
  const totalViews = events.reduce((sum, event) => sum + event.views, 0);
  const totalClicks = events.reduce((sum, event) => sum + event.clicks, 0);

  // Calculate revenue (if events have price and attendance data)
  const revenueGenerated = events.reduce((sum, event) => {
    return sum + (event.price || 0) * (event.views || 0) * 0.1; // Assume 10% conversion rate
  }, 0);

  // Calculate popular categories
  const popularCategories: { [key: string]: number } = {};
  events.forEach((event) => {
    const category = event.category || "other";
    popularCategories[category] = (popularCategories[category] || 0) + 1;
  });

  // Calculate monthly stats (simplified)
  const monthlyStats: {
    [month: string]: {
      events: number;
      views: number;
      clicks: number;
      revenue: number;
    };
  } = {};
  events.forEach((event) => {
    const month = event.created_at.toDate().toISOString().slice(0, 7); // YYYY-MM
    if (!monthlyStats[month]) {
      monthlyStats[month] = { events: 0, views: 0, clicks: 0, revenue: 0 };
    }
    monthlyStats[month].events += 1;
    monthlyStats[month].views += event.views;
    monthlyStats[month].clicks += event.clicks;
    monthlyStats[month].revenue +=
      (event.price || 0) * (event.views || 0) * 0.1;
  });

  return {
    total_events: totalEvents,
    total_views: totalViews,
    total_clicks: totalClicks,
    revenue_generated: revenueGenerated,
    avg_attendance_rate: totalEvents > 0 ? totalClicks / totalViews || 0 : 0,
    popular_categories: popularCategories,
    monthly_stats: monthlyStats,
  };
};

export const incrementEventClicks = async (eventId: string) => {
  const docRef = doc(meetupsCollection, eventId);
  await updateDoc(docRef, {
    clicks: increment(1),
  });
};

// Live Events (public-facing)
export const getLiveEvents = async (
  limit_count: number = 20
): Promise<BusinessEvent[]> => {
  const q = query(
    meetupsCollection,
    where("is_live", "==", true),
    where("expiration_date", ">", Timestamp.now()),
    orderBy("expiration_date", "asc"),
    limit(limit_count)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    location: {
      latitude: doc.data().location.latitude,
      longitude: doc.data().location.longitude,
    },
  })) as BusinessEvent[];
};
