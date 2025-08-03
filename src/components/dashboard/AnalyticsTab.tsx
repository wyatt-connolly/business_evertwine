"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Wine,
  Star,
} from "lucide-react";

// Mock data for analytics
const revenueData = [
  { month: "Jan", revenue: 2400, events: 12, customers: 180 },
  { month: "Feb", revenue: 1398, events: 8, customers: 120 },
  { month: "Mar", revenue: 9800, events: 18, customers: 220 },
  { month: "Apr", revenue: 3908, events: 15, customers: 195 },
  { month: "May", revenue: 4800, events: 20, customers: 280 },
  { month: "Jun", revenue: 3800, events: 16, customers: 240 },
  { month: "Jul", revenue: 4300, events: 22, customers: 320 },
];

const eventTypeData = [
  { name: "Wine Tastings", value: 45, color: "#8B5CF6" },
  { name: "Private Events", value: 25, color: "#10B981" },
  { name: "Corporate Events", value: 20, color: "#F59E0B" },
  { name: "Wine Dinners", value: 10, color: "#EF4444" },
];

const attendanceData = [
  { day: "Mon", attendance: 12 },
  { day: "Tue", attendance: 19 },
  { day: "Wed", attendance: 15 },
  { day: "Thu", attendance: 22 },
  { day: "Fri", attendance: 28 },
  { day: "Sat", attendance: 35 },
  { day: "Sun", attendance: 18 },
];

const topWinesData = [
  { name: "Château Margaux 2019", sales: 45, revenue: 4500 },
  { name: "Dom Pérignon 2012", sales: 32, revenue: 6400 },
  { name: "Opus One 2018", sales: 28, revenue: 8400 },
  { name: "Screaming Eagle 2017", sales: 15, revenue: 7500 },
  { name: "Caymus Cabernet", sales: 42, revenue: 2100 },
];

const customerSatisfactionData = [
  { month: "Jan", satisfaction: 4.2 },
  { month: "Feb", satisfaction: 4.1 },
  { month: "Mar", satisfaction: 4.5 },
  { month: "Apr", satisfaction: 4.3 },
  { month: "May", satisfaction: 4.6 },
  { month: "Jun", satisfaction: 4.4 },
  { month: "Jul", satisfaction: 4.7 },
];

export default function AnalyticsTab() {
  // Calculate metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalEvents = revenueData.reduce((sum, item) => sum + item.events, 0);
  const totalCustomers = revenueData[revenueData.length - 1]?.customers || 0;
  const avgSatisfaction =
    customerSatisfactionData.reduce((sum, item) => sum + item.satisfaction, 0) /
    customerSatisfactionData.length;

  // Calculate growth rates
  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const revenueGrowth = previousMonth
    ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) *
      100
    : 0;
  const customerGrowth = previousMonth
    ? ((currentMonth.customers - previousMonth.customers) /
        previousMonth.customers) *
      100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <p className="text-gray-600">
          Track your business performance and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <div className="flex items-center mt-1">
                  {revenueGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEvents}
                </p>
                <p className="text-sm text-gray-600">Total Events</p>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-gray-500">This period</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCustomers}
                </p>
                <p className="text-sm text-gray-600">Active Customers</p>
                <div className="flex items-center mt-1">
                  {customerGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      customerGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Math.abs(customerGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {avgSatisfaction.toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-500">
                    Customer satisfaction
                  </span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Types Distribution</CardTitle>
                <CardDescription>Breakdown of events by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {eventTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Attendance by Day</CardTitle>
              <CardDescription>Weekly attendance patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>
                  Customer acquisition over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Average rating over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={customerSatisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip formatter={(value) => [`${value}/5`, "Rating"]} />
                    <Line
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: "#F59E0B" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Wines</CardTitle>
              <CardDescription>
                Best selling wines by revenue and quantity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topWinesData.map((wine, index) => (
                  <div
                    key={wine.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {wine.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Wine className="w-4 h-4 mr-1" />
                            {wine.sales} bottles sold
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />$
                            {wine.revenue.toLocaleString()} revenue
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${wine.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {wine.sales} units
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
