"use client";

import { useEffect, useRef, useState } from "react";
import { analyticsService, AnalyticsDocument } from "@/lib/analytics";
import { useAuth } from "@/contexts/AuthContext";

export const useAnalytics = () => {
  const { user } = useAuth();
  const viewStartTime = useRef<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Track page view
  const trackView = async (
    meetupId: string,
    businessId: string,
    options?: {
      source?: "direct" | "search" | "social" | "referral";
      referrer?: string;
    }
  ) => {
    try {
      viewStartTime.current = Date.now();
      setIsTracking(true);

      // Get location (simplified - in production you'd use a geolocation service)
      const location = {
        city: "Unknown",
        country: "Unknown",
      };

      const result = await analyticsService.trackView(meetupId, businessId, {
        viewerId: user?.uid,
        source: options?.source || "direct",
        referrer: options?.referrer,
        location,
      });

      return result;
    } catch (error) {
      console.error("Error tracking view:", error);
      return { success: false, error };
    }
  };

  // Track engagement event
  const trackEngagement = async (
    meetupId: string,
    businessId: string,
    eventType: "click" | "share" | "bookmark" | "inquiry" | "registration",
    eventData?: Record<string, string | number | boolean>
  ) => {
    try {
      return await analyticsService.trackEngagement(
        meetupId,
        businessId,
        eventType,
        {
          viewerId: user?.uid,
          eventData,
        }
      );
    } catch (error) {
      console.error("Error tracking engagement:", error);
      return { success: false, error };
    }
  };

  // Track view duration when component unmounts
  const trackViewEnd = async (meetupId: string, businessId: string) => {
    if (viewStartTime.current && isTracking) {
      const viewDuration = Math.floor(
        (Date.now() - viewStartTime.current) / 1000
      ); // in seconds

      if (viewDuration > 0) {
        try {
          await analyticsService.trackView(meetupId, businessId, {
            viewerId: user?.uid,
            viewDuration,
          });
        } catch (error) {
          console.error("Error tracking view duration:", error);
        }
      }

      viewStartTime.current = null;
      setIsTracking(false);
    }
  };

  return {
    trackView,
    trackEngagement,
    trackViewEnd,
    isTracking,
  };
};

export const useBusinessAnalytics = (businessId?: string) => {
  const [analytics, setAnalytics] = useState<AnalyticsDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await analyticsService.getBusinessAnalytics(businessId);
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error("Error loading analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [businessId]);

  const refreshAnalytics = async () => {
    if (businessId) {
      try {
        const data = await analyticsService.getBusinessAnalytics(businessId);
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error("Error refreshing analytics:", err);
        setError("Failed to refresh analytics data");
      }
    }
  };

  return {
    analytics,
    loading,
    error,
    refreshAnalytics,
  };
};

export const useBusinessMetrics = (businessId?: string) => {
  const [metrics, setMetrics] = useState<{
    totalImpressions: number;
    totalUniqueViewers: number;
    totalClicks: number;
    totalShares: number;
    totalBookmarks: number;
    totalInquiries: number;
    totalRegistrations: number;
    totalRevenue: number;
    avgViewDuration: number;
    clickThroughRate: number;
    conversionRate: number;
    meetupCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await analyticsService.getBusinessMetrics(businessId);
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error("Error loading metrics:", err);
        setError("Failed to load metrics data");
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [businessId]);

  const refreshMetrics = async () => {
    if (businessId) {
      try {
        const data = await analyticsService.getBusinessMetrics(businessId);
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error("Error refreshing metrics:", err);
        setError("Failed to refresh metrics data");
      }
    }
  };

  return {
    metrics,
    loading,
    error,
    refreshMetrics,
  };
};
