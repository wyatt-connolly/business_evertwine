"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Calendar,
  BarChart3,
  Users,
  Settings,
  Plus,
  TrendingUp,
  Bell,
  MapPin,
  Clock,
  DollarSign,
  Wine,
  Target,
} from "lucide-react";
import { useState } from "react";
import EventsTab from "./dashboard/EventsTab";
import AnalyticsTab from "./dashboard/AnalyticsTab";
import CustomersTab from "./dashboard/CustomersTab";
import SettingsTab from "./dashboard/SettingsTab";

export default function BusinessDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Mock business data
  const stats = {
    totalEvents: 24,
    activeEvents: 8,
    totalCustomers: 156,
    monthlyRevenue: 12450,
    upcomingEvents: [
      {
        id: 1,
        title: "Premium Wine Tasting",
        date: "2025-08-05",
        time: "18:00",
        attendees: 15,
        maxAttendees: 20,
        location: "Downtown Wine Bar",
        revenue: 1275,
      },
      {
        id: 2,
        title: "Corporate Team Building",
        date: "2025-08-08",
        time: "14:00",
        attendees: 32,
        maxAttendees: 40,
        location: "Business Center",
        revenue: 3840,
      },
      {
        id: 3,
        title: "Private Wine Dinner",
        date: "2025-08-12",
        time: "19:30",
        attendees: 8,
        maxAttendees: 12,
        location: "Private Residence",
        revenue: 1600,
      },
    ],
    recentActivities: [
      {
        action: "New customer registration",
        detail: "Sarah Johnson",
        time: "2 hours ago",
      },
      {
        action: "Event fully booked",
        detail: "Summer Wine Festival",
        time: "4 hours ago",
      },
      {
        action: "Payment received",
        detail: "Corporate Event #156 - $3,840",
        time: "6 hours ago",
      },
      {
        action: "New inquiry",
        detail: "Private tasting for 15 people",
        time: "1 day ago",
      },
      {
        action: "Review posted",
        detail: "5-star review for Wine Dinner",
        time: "2 days ago",
      },
    ],
    quickStats: {
      avgEventSize: 18,
      bookingRate: 0.78,
      customerSatisfaction: 4.8,
      repeatCustomers: 0.42,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wine className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Business Evertwine
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.displayName || user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Customers</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Events</p>
                      <p className="text-3xl font-bold">{stats.totalEvents}</p>
                    </div>
                    <Calendar className="h-12 w-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Active Events</p>
                      <p className="text-3xl font-bold">{stats.activeEvents}</p>
                    </div>
                    <Clock className="h-12 w-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Customers</p>
                      <p className="text-3xl font-bold">
                        {stats.totalCustomers}
                      </p>
                    </div>
                    <Users className="h-12 w-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Monthly Revenue</p>
                      <p className="text-3xl font-bold">
                        ${stats.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="h-12 w-12 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.quickStats.avgEventSize}
                  </p>
                  <p className="text-sm text-gray-600">Avg Event Size</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(stats.quickStats.bookingRate * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Booking Rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Wine className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.quickStats.customerSatisfaction}
                  </p>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(stats.quickStats.repeatCustomers * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Repeat Rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Upcoming Events</span>
                    <Button size="sm" onClick={() => setActiveTab("events")}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Event
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Your next scheduled wine events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {event.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {event.date} at {event.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              {event.attendees}/{event.maxAttendees} attendees
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              ${event.revenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{
                                width: `${
                                  (event.attendees / event.maxAttendees) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest business updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.detail}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <EventsTab />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
