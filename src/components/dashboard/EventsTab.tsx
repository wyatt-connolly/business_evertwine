"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Clock,
  Building,
} from "lucide-react";

interface Meetup {
  id: string;
  // Core Required Fields
  creator_type: "business";
  business_id: string;
  business_name: string;
  title: string;
  activity: string;
  location: {
    latitude: number;
    longitude: number;
  };
  // Optional Fields
  image_url?: string;
  category?: string;
  address?: string;
  description?: string;
  // Display fields
  date: string;
  time: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  status: "active" | "completed" | "cancelled";
}

export default function EventsTab() {
  const [meetups, setMeetups] = useState<Meetup[]>([
    {
      id: "1",
      creator_type: "business",
      business_id: "biz_001",
      business_name: "Downtown Event Space",
      title: "Networking Meetup",
      activity: "Professional Networking",
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
      category: "restaurant",
      address: "123 Main St, San Francisco, CA",
      description: "Connect with local professionals in a relaxed environment",
      image_url: "https://example.com/event1.jpg",
      date: "2025-08-05",
      time: "18:00",
      maxAttendees: 20,
      currentAttendees: 15,
      price: 25,
      status: "active",
    },
    {
      id: "2",
      creator_type: "business",
      business_id: "biz_002",
      business_name: "Fitness First Gym",
      title: "Workout Workshop",
      activity: "Fitness Training",
      location: {
        latitude: 37.7849,
        longitude: -122.4094,
      },
      category: "fitness",
      address: "456 Gym Ave, San Francisco, CA",
      description: "Learn proper form and technique in this hands-on workshop",
      date: "2025-08-08",
      time: "14:00",
      maxAttendees: 40,
      currentAttendees: 32,
      price: 35,
      status: "active",
    },
    {
      id: "3",
      creator_type: "business",
      business_id: "biz_003",
      business_name: "Artisan Coffee Co",
      title: "Coffee Tasting",
      activity: "Coffee Education",
      location: {
        latitude: 37.7649,
        longitude: -122.4294,
      },
      category: "cafe",
      address: "789 Coffee Blvd, San Francisco, CA",
      description: "Discover unique coffee flavors from around the world",
      date: "2025-08-12",
      time: "19:30",
      maxAttendees: 12,
      currentAttendees: 8,
      price: 20,
      status: "active",
    },
    {
      id: "4",
      creator_type: "business",
      business_id: "biz_004",
      business_name: "Local Bar & Grill",
      title: "Happy Hour Social",
      activity: "Social Gathering",
      location: {
        latitude: 37.7549,
        longitude: -122.4394,
      },
      category: "bar",
      address: "321 Bar Street, San Francisco, CA",
      description: "Unwind after work with drinks and conversation",
      date: "2025-07-25",
      time: "17:00",
      maxAttendees: 25,
      currentAttendees: 25,
      price: 15,
      status: "completed",
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newMeetup, setNewMeetup] = useState({
    // Core Required Fields
    business_name: "",
    title: "",
    activity: "",
    location: "",
    // Optional Fields
    image_url: "",
    category: "",
    address: "",
    description: "",
    // Additional fields
    date: "",
    time: "",
    maxAttendees: "",
    price: "",
  });

  const handleCreateMeetup = () => {
    if (
      !newMeetup.business_name ||
      !newMeetup.title ||
      !newMeetup.activity ||
      !newMeetup.date ||
      !newMeetup.time
    )
      return;

    const meetup: Meetup = {
      id: Date.now().toString(),
      creator_type: "business",
      business_id: `biz_${Date.now()}`, // In real app, this would come from auth context
      business_name: newMeetup.business_name,
      title: newMeetup.title,
      activity: newMeetup.activity,
      location: {
        latitude: 37.7749, // In real app, this would come from location autocomplete
        longitude: -122.4194,
      },
      image_url: newMeetup.image_url || undefined,
      category: newMeetup.category || undefined,
      address: newMeetup.address || undefined,
      description: newMeetup.description || undefined,
      date: newMeetup.date,
      time: newMeetup.time,
      maxAttendees: parseInt(newMeetup.maxAttendees) || 10,
      currentAttendees: 0,
      price: parseFloat(newMeetup.price) || 0,
      status: "active",
    };

    setMeetups([...meetups, meetup]);
    setNewMeetup({
      business_name: "",
      title: "",
      activity: "",
      location: "",
      image_url: "",
      category: "",
      address: "",
      description: "",
      date: "",
      time: "",
      maxAttendees: "",
      price: "",
    });
    setIsCreateDialogOpen(false);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "restaurant":
        return <DollarSign className="w-4 h-4" />; // 🍽️
      case "fitness":
        return <Users className="w-4 h-4" />; // 💪
      case "bar":
        return <DollarSign className="w-4 h-4" />; // 🍺
      case "cafe":
        return <Clock className="w-4 h-4" />; // ☕
      case "entertainment":
        return <Eye className="w-4 h-4" />; // 🎭
      case "retail":
        return <Building className="w-4 h-4" />; // 🛍️
      case "service":
        return <Building className="w-4 h-4" />; // 🔧
      case "health":
        return <Building className="w-4 h-4" />; // 🏥
      case "education":
        return <Building className="w-4 h-4" />; // 📚
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  const totalRevenue = meetups.reduce(
    (sum, meetup) => sum + meetup.price * meetup.currentAttendees,
    0
  );

  const avgAttendance =
    meetups.length > 0
      ? meetups.reduce(
          (sum, meetup) => sum + meetup.currentAttendees / meetup.maxAttendees,
          0
        ) / meetups.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Meetups Management
          </h2>
          <p className="text-gray-600">
            Create and manage your business meetups
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Meetup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Business Meetup</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new meetup for your business
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {/* Core Required Fields */}
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  value={newMeetup.business_name}
                  onChange={(e) =>
                    setNewMeetup({
                      ...newMeetup,
                      business_name: e.target.value,
                    })
                  }
                  placeholder="Your Business Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Meetup Title *</Label>
                <Input
                  id="title"
                  value={newMeetup.title}
                  onChange={(e) =>
                    setNewMeetup({ ...newMeetup, title: e.target.value })
                  }
                  placeholder="Networking Meetup"
                />
              </div>
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label htmlFor="activity">Activity Type *</Label>
                <Input
                  id="activity"
                  value={newMeetup.activity}
                  onChange={(e) =>
                    setNewMeetup({ ...newMeetup, activity: e.target.value })
                  }
                  placeholder="Professional Networking, Workshop, etc."
                />
              </div>

              {/* Important Optional Fields */}
              <div className="space-y-2">
                <Label htmlFor="category">Business Category</Label>
                <Select
                  value={newMeetup.category}
                  onValueChange={(value) =>
                    setNewMeetup({ ...newMeetup, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">🍽️ Restaurant</SelectItem>
                    <SelectItem value="fitness">💪 Fitness</SelectItem>
                    <SelectItem value="bar">🍺 Bar</SelectItem>
                    <SelectItem value="cafe">☕ Cafe</SelectItem>
                    <SelectItem value="entertainment">
                      🎭 Entertainment
                    </SelectItem>
                    <SelectItem value="retail">🛍️ Retail</SelectItem>
                    <SelectItem value="service">🔧 Service</SelectItem>
                    <SelectItem value="health">🏥 Health</SelectItem>
                    <SelectItem value="education">📚 Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Business Image URL</Label>
                <Input
                  id="image_url"
                  value={newMeetup.image_url}
                  onChange={(e) =>
                    setNewMeetup({ ...newMeetup, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label htmlFor="address">Physical Address</Label>
                <Input
                  id="address"
                  value={newMeetup.address}
                  onChange={(e) =>
                    setNewMeetup({ ...newMeetup, address: e.target.value })
                  }
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newMeetup.description}
                  onChange={(e) =>
                    setNewMeetup({ ...newMeetup, description: e.target.value })
                  }
                  placeholder="Describe your meetup, what attendees can expect..."
                  rows={3}
                />
              </div>

              {/* Location Field - Required for map positioning */}
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label htmlFor="location">Location *</Label>
                <LocationAutocomplete
                  id="location"
                  value={newMeetup.location}
                  onChange={(value) =>
                    setNewMeetup({ ...newMeetup, location: value })
                  }
                  placeholder="Search for venue address or coordinates"
                />
              </div>

              {/* Additional Event Details */}
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMeetup.date}
                  onChange={(e) =>
                    setNewMeetup({ ...newMeetup, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={newMeetup.time}
                  onChange={(e) =>
                    setNewMeetup({ ...newMeetup, time: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Max Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={newMeetup.maxAttendees}
                  onChange={(e) =>
                    setNewMeetup({ ...newMeetup, maxAttendees: e.target.value })
                  }
                  placeholder="20"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newMeetup.price}
                  onChange={(e) =>
                    setNewMeetup({ ...newMeetup, price: e.target.value })
                  }
                  placeholder="25.00"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateMeetup}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create Meetup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {meetups.length}
                </p>
                <p className="text-sm text-gray-600">Total Meetups</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(avgAttendance * 100)}%
                </p>
                <p className="text-sm text-gray-600">Avg Fill Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meetups List */}
      <Card>
        <CardHeader>
          <CardTitle>All Meetups</CardTitle>
          <CardDescription>
            Manage your business meetups and bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetups.map((meetup) => (
              <div
                key={meetup.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {getCategoryIcon(meetup.category)}
                    <h3 className="font-semibold text-gray-900 truncate">
                      {meetup.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        meetup.status === "active"
                          ? "bg-green-100 text-green-800"
                          : meetup.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {meetup.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {meetup.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {meetup.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {meetup.time}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {meetup.address || "TBD"}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {meetup.currentAttendees}/{meetup.maxAttendees}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />${meetup.price}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
