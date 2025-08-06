import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
  serverTimestamp,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// Single analytics document interface with type field
export interface AnalyticsDocument {
  id?: string;
  type: "view" | "engagement" | "summary";
  meetupId: string;
  businessId: string;
  timestamp: Timestamp;

  // View-specific fields
  viewerId?: string; // user ID if logged in, otherwise generated session ID
  isUnique?: boolean;
  viewDuration?: number;
  source?: "direct" | "search" | "social" | "referral";
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  deviceType?: "mobile" | "tablet" | "desktop";

  // Engagement-specific fields
  eventType?: "click" | "share" | "bookmark" | "inquiry" | "registration";
  eventData?: Record<string, string | number | boolean>;

  // Summary-specific fields (aggregated data)
  totalImpressions?: number;
  uniqueViewers?: number;
  avgViewDuration?: number;
  lastViewed?: Timestamp;
  clicks?: number;
  shares?: number;
  bookmarks?: number;
  inquiries?: number;
  registrations?: number;
  attendees?: number;
  revenue?: number;
  conversionRate?: number;
  directTraffic?: number;
  searchTraffic?: number;
  socialTraffic?: number;
  referralTraffic?: number;
  topLocations?: Array<{ city: string; country: string; count: number }>;
  peakViewingHours?: Array<{ hour: number; count: number }>;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Type guards for better TypeScript support
export function isViewEvent(
  doc: AnalyticsDocument
): doc is AnalyticsDocument & { type: "view" } {
  return doc.type === "view";
}

export function isEngagementEvent(
  doc: AnalyticsDocument
): doc is AnalyticsDocument & { type: "engagement" } {
  return doc.type === "engagement";
}

export function isSummaryEvent(
  doc: AnalyticsDocument
): doc is AnalyticsDocument & { type: "summary" } {
  return doc.type === "summary";
}

class AnalyticsService {
  private readonly ANALYTICS_COLLECTION = "analytics";

  // Track a view event
  async trackView(
    meetupId: string,
    businessId: string,
    options: {
      viewerId?: string;
      viewDuration?: number;
      source?: "direct" | "search" | "social" | "referral";
      referrer?: string;
      location?: {
        city: string;
        country: string;
        latitude?: number;
        longitude?: number;
      };
    } = {}
  ) {
    try {
      const {
        viewerId,
        viewDuration = 0,
        source = "direct",
        referrer,
        location,
      } = options;

      // Generate session ID if no viewer ID
      const sessionId = viewerId || this.generateSessionId();

      // Check if this is a unique view in the last 24 hours
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const uniqueViewQuery = query(
        collection(db, this.ANALYTICS_COLLECTION),
        where("type", "==", "view"),
        where("meetupId", "==", meetupId),
        where("viewerId", "==", sessionId),
        where("timestamp", ">=", Timestamp.fromDate(oneDayAgo))
      );

      const uniqueViewSnapshot = await getDocs(uniqueViewQuery);
      const isUnique = uniqueViewSnapshot.empty;

      // Create view analytics document
      const viewDoc: AnalyticsDocument = {
        type: "view",
        meetupId,
        businessId,
        viewerId: sessionId,
        isUnique,
        viewDuration,
        source,
        referrer,
        location,
        deviceType: this.getDeviceType(),
        timestamp: serverTimestamp() as Timestamp,
      };

      // Add view event to analytics collection
      await addDoc(collection(db, this.ANALYTICS_COLLECTION), viewDoc);

      // Update or create analytics summary
      await this.updateAnalyticsSummary(meetupId, businessId, {
        impressions: 1,
        uniqueViews: isUnique ? 1 : 0,
        viewDuration,
        source,
        location,
      });

      return { success: true, isUnique };
    } catch (error) {
      console.error("Error tracking view:", error);
      return { success: false, error };
    }
  }

  // Track engagement events
  async trackEngagement(
    meetupId: string,
    businessId: string,
    eventType: "click" | "share" | "bookmark" | "inquiry" | "registration",
    options: {
      viewerId?: string;
      eventData?: Record<string, string | number | boolean>;
    } = {}
  ) {
    try {
      const { viewerId, eventData } = options;
      const sessionId = viewerId || this.generateSessionId();

      const engagementDoc: AnalyticsDocument = {
        type: "engagement",
        meetupId,
        businessId,
        viewerId: sessionId,
        eventType,
        eventData,
        timestamp: serverTimestamp() as Timestamp,
      };

      await addDoc(collection(db, this.ANALYTICS_COLLECTION), engagementDoc);

      // Update analytics summary
      const updateData = {
        [eventType + "s"]: increment(1),
      };

      await this.updateAnalyticsSummary(meetupId, businessId, updateData);

      return { success: true };
    } catch (error) {
      console.error("Error tracking engagement:", error);
      return { success: false, error };
    }
  }

  // Update analytics summary document
  private async updateAnalyticsSummary(
    meetupId: string,
    businessId: string,
    updates: {
      impressions?: number;
      uniqueViews?: number;
      viewDuration?: number;
      source?: string;
      location?: { city: string; country: string };
      clicks?: number;
      shares?: number;
      bookmarks?: number;
      inquiries?: number;
      registrations?: number;
    }
  ) {
    try {
      // Check if analytics summary document exists
      const analyticsQuery = query(
        collection(db, this.ANALYTICS_COLLECTION),
        where("type", "==", "summary"),
        where("meetupId", "==", meetupId)
      );

      const analyticsSnapshot = await getDocs(analyticsQuery);

      if (analyticsSnapshot.empty) {
        // Create new analytics summary document
        const newAnalytics: AnalyticsDocument = {
          type: "summary",
          meetupId,
          businessId,
          totalImpressions: updates.impressions || 0,
          uniqueViewers: updates.uniqueViews || 0,
          avgViewDuration: updates.viewDuration || 0,
          clicks: 0,
          shares: 0,
          bookmarks: 0,
          inquiries: 0,
          registrations: 0,
          attendees: 0,
          revenue: 0,
          conversionRate: 0,
          directTraffic: updates.source === "direct" ? 1 : 0,
          searchTraffic: updates.source === "search" ? 1 : 0,
          socialTraffic: updates.source === "social" ? 1 : 0,
          referralTraffic: updates.source === "referral" ? 1 : 0,
          topLocations: updates.location
            ? [{ ...updates.location, count: 1 }]
            : [],
          peakViewingHours: [],
          timestamp: serverTimestamp() as Timestamp,
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
        };

        await addDoc(collection(db, this.ANALYTICS_COLLECTION), newAnalytics);
      } else {
        // Update existing analytics summary document
        const analyticsDoc = analyticsSnapshot.docs[0];
        const currentData = analyticsDoc.data() as AnalyticsDocument;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: Record<string, any> = {
          updatedAt: serverTimestamp(),
          lastViewed: serverTimestamp(),
        };

        if (updates.impressions) {
          updateData.totalImpressions = increment(updates.impressions);
        }

        if (updates.uniqueViews) {
          updateData.uniqueViewers = increment(updates.uniqueViews);
        }

        if (updates.viewDuration) {
          // Calculate new average view duration
          const totalViews =
            (currentData.totalImpressions || 0) + (updates.impressions || 0);
          const currentTotal =
            (currentData.avgViewDuration || 0) *
            (currentData.totalImpressions || 0);
          const newAverage = (currentTotal + updates.viewDuration) / totalViews;
          updateData.avgViewDuration = newAverage;
        }

        // Update traffic sources
        if (updates.source) {
          const sourceField = updates.source + "Traffic";
          updateData[sourceField] = increment(1);
        }

        // Update top locations
        if (updates.location) {
          const locations = currentData.topLocations || [];
          const existingLocation = locations.find(
            (loc: { city: string; country: string; count: number }) =>
              loc.city === updates.location!.city &&
              loc.country === updates.location!.country
          );

          if (existingLocation) {
            existingLocation.count += 1;
          } else {
            locations.push({ ...updates.location, count: 1 });
          }

          // Keep only top 10 locations
          updateData.topLocations = locations
            .sort(
              (a: { count: number }, b: { count: number }) => b.count - a.count
            )
            .slice(0, 10);
        }

        // Handle other incremental updates
        if (updates.clicks) updateData.clicks = increment(updates.clicks);
        if (updates.shares) updateData.shares = increment(updates.shares);
        if (updates.bookmarks)
          updateData.bookmarks = increment(updates.bookmarks);
        if (updates.inquiries)
          updateData.inquiries = increment(updates.inquiries);
        if (updates.registrations)
          updateData.registrations = increment(updates.registrations);

        await updateDoc(analyticsDoc.ref, updateData);
      }
    } catch (error) {
      console.error("Error updating analytics summary:", error);
    }
  }

  // Get analytics for a specific meetup
  async getMeetupAnalytics(
    meetupId: string
  ): Promise<AnalyticsDocument | null> {
    try {
      const analyticsQuery = query(
        collection(db, this.ANALYTICS_COLLECTION),
        where("type", "==", "summary"),
        where("meetupId", "==", meetupId)
      );

      const analyticsSnapshot = await getDocs(analyticsQuery);

      if (analyticsSnapshot.empty) {
        return null;
      }

      const analyticsDoc = analyticsSnapshot.docs[0];
      return {
        id: analyticsDoc.id,
        ...analyticsDoc.data(),
      } as AnalyticsDocument;
    } catch (error) {
      console.error("Error getting meetup analytics:", error);
      return null;
    }
  }

  // Get analytics for all business meetups
  async getBusinessAnalytics(businessId: string): Promise<AnalyticsDocument[]> {
    try {
      const analyticsQuery = query(
        collection(db, this.ANALYTICS_COLLECTION),
        where("type", "==", "summary"),
        where("businessId", "==", businessId),
        orderBy("updatedAt", "desc")
      );

      const analyticsSnapshot = await getDocs(analyticsQuery);

      return analyticsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AnalyticsDocument[];
    } catch (error) {
      console.error("Error getting business analytics:", error);
      return [];
    }
  }

  // Get aggregated business metrics
  async getBusinessMetrics(businessId: string) {
    try {
      const analytics = await this.getBusinessAnalytics(businessId);

      const metrics = analytics.reduce(
        (acc, item) => {
          acc.totalImpressions += item.totalImpressions || 0;
          acc.totalUniqueViewers += item.uniqueViewers || 0;
          acc.totalClicks += item.clicks || 0;
          acc.totalShares += item.shares || 0;
          acc.totalBookmarks += item.bookmarks || 0;
          acc.totalInquiries += item.inquiries || 0;
          acc.totalRegistrations += item.registrations || 0;
          acc.totalRevenue += item.revenue || 0;
          acc.avgViewDuration += item.viewDuration || 0;
          return acc;
        },
        {
          totalImpressions: 0,
          totalUniqueViewers: 0,
          totalClicks: 0,
          totalShares: 0,
          totalBookmarks: 0,
          totalInquiries: 0,
          totalRegistrations: 0,
          totalRevenue: 0,
          avgViewDuration: 0,
        }
      );

      // Calculate averages
      const meetupCount = analytics.length;
      if (meetupCount > 0) {
        metrics.avgViewDuration = metrics.avgViewDuration / meetupCount;
      }

      // Calculate conversion rates
      const clickThroughRate =
        metrics.totalImpressions > 0
          ? (metrics.totalClicks / metrics.totalImpressions) * 100
          : 0;

      const conversionRate =
        metrics.totalClicks > 0
          ? (metrics.totalRegistrations / metrics.totalClicks) * 100
          : 0;

      return {
        ...metrics,
        clickThroughRate,
        conversionRate,
        meetupCount,
      };
    } catch (error) {
      console.error("Error getting business metrics:", error);
      return null;
    }
  }

  // Utility functions
  private generateSessionId(): string {
    return (
      "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
    );
  }

  private getDeviceType(): "mobile" | "tablet" | "desktop" {
    if (typeof window === "undefined") return "desktop";

    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return "tablet";
    }
    if (
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent
      )
    ) {
      return "mobile";
    }
    return "desktop";
  }

  // Get time-based analytics
  async getTimeBasedAnalytics(businessId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const viewsQuery = query(
        collection(db, this.ANALYTICS_COLLECTION),
        where("type", "==", "view"),
        where("businessId", "==", businessId),
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        orderBy("timestamp", "desc")
      );

      const viewsSnapshot = await getDocs(viewsQuery);

      // Group by date
      const dailyStats: Record<
        string,
        {
          date: string;
          impressions: number;
          uniqueViews: number;
          avgDuration: number;
          totalDuration: number;
        }
      > = {};

      viewsSnapshot.docs.forEach((doc) => {
        const data = doc.data() as AnalyticsDocument;
        const dateKey = data.timestamp.toDate().toDateString();

        if (!dailyStats[dateKey]) {
          dailyStats[dateKey] = {
            date: dateKey,
            impressions: 0,
            uniqueViews: 0,
            avgDuration: 0,
            totalDuration: 0,
          };
        }

        dailyStats[dateKey].impressions += 1;
        if (data.isUnique) {
          dailyStats[dateKey].uniqueViews += 1;
        }
        dailyStats[dateKey].totalDuration += data.viewDuration || 0;
      });

      // Calculate averages
      Object.values(dailyStats).forEach((stat) => {
        stat.avgDuration =
          stat.impressions > 0 ? stat.totalDuration / stat.impressions : 0;
      });

      return Object.values(dailyStats).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error("Error getting time-based analytics:", error);
      return [];
    }
  }
}

export const analyticsService = new AnalyticsService();
