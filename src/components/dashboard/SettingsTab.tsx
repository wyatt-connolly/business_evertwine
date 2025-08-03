"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Building, Bell, Save } from "lucide-react";
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";
import Image from "next/image";

export default function SettingsTab() {
  const { businessProfile, updateBusinessProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [businessInfo, setBusinessInfo] = useState({
    business_name: "",
    contact_email: "",
    bio: "",
    photo_url: "",
    address: "",
    location: { latitude: 37.7749, longitude: -122.4194 },
  });

  const [notifications, setNotifications] = useState({
    notification_promotion_updates: true,
    notification_customer_interactions: true,
    notification_marketing_updates: false,
    notification_account_alerts: true,
  });

  const [businessSettings, setBusinessSettings] = useState({
    timezone: "America/Los_Angeles",
    auto_approve_events: true,
    allow_public_events: true,
  });

  // Load existing data when component mounts
  useEffect(() => {
    if (businessProfile) {
      setBusinessInfo({
        business_name: businessProfile.business_name || "",
        contact_email: businessProfile.contact_email || "",
        bio: businessProfile.bio || "",
        photo_url: businessProfile.photo_url || "",
        address: businessProfile.address || "",
        location: businessProfile.location || {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      });

      setNotifications({
        notification_promotion_updates:
          businessProfile.notification_promotion_updates ?? true,
        notification_customer_interactions:
          businessProfile.notification_customer_interactions ?? true,
        notification_marketing_updates:
          businessProfile.notification_marketing_updates ?? false,
        notification_account_alerts:
          businessProfile.notification_account_alerts ?? true,
      });

      setBusinessSettings({
        timezone:
          businessProfile.business_settings?.timezone || "America/Los_Angeles",
        auto_approve_events:
          businessProfile.business_settings?.auto_approve_events ?? true,
        allow_public_events:
          businessProfile.business_settings?.allow_public_events ?? true,
      });
    }
  }, [businessProfile]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // Combine all the data to update
      const updateData = {
        ...businessInfo,
        ...notifications,
        business_settings: businessSettings,
      };

      console.log("Saving business profile with data:", updateData);

      await updateBusinessProfile(updateData);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: {
    display_name: string;
    lat: string;
    lon: string;
    place_id: string;
  }) => {
    setBusinessInfo((prev) => ({
      ...prev,
      address: location.display_name,
      location: {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
      },
    }));
  };

  const handleAddressChange = (address: string) => {
    setBusinessInfo((prev) => ({ ...prev, address }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Business Settings
          </h2>
          <p className="text-muted-foreground">
            Manage your business profile and account preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <Building className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Business Name */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    value={businessInfo.business_name}
                    onChange={(e) =>
                      setBusinessInfo({
                        ...businessInfo,
                        business_name: e.target.value,
                      })
                    }
                    placeholder="Your business name"
                  />
                </div>
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={businessInfo.contact_email}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      contact_email: e.target.value,
                    })
                  }
                  placeholder="business@example.com"
                />
              </div>

              {/* Business Logo */}
              <div className="space-y-2">
                <Label htmlFor="photo_upload">Business Logo</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="photo_upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const fileUrl = URL.createObjectURL(file);
                        setBusinessInfo({
                          ...businessInfo,
                          photo_url: fileUrl,
                        });
                      }
                    }}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {businessInfo.photo_url && (
                    <div className="w-16 h-16 border rounded-lg overflow-hidden">
                      <Image
                        src={businessInfo.photo_url}
                        alt="Business logo"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Business Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <LocationAutocomplete
                  id="address"
                  value={businessInfo.address}
                  onChange={handleAddressChange}
                  onLocationSelect={handleLocationSelect}
                  placeholder="Search for your business address"
                />
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label htmlFor="bio">Business Description</Label>
                <Textarea
                  id="bio"
                  value={businessInfo.bio}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, bio: e.target.value })
                  }
                  placeholder="Describe your business and what you offer..."
                  rows={4}
                />
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={businessSettings.timezone}
                  onValueChange={(value) =>
                    setBusinessSettings({
                      ...businessSettings,
                      timezone: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Los_Angeles">
                      Pacific Time (PT)
                    </SelectItem>
                    <SelectItem value="America/Denver">
                      Mountain Time (MT)
                    </SelectItem>
                    <SelectItem value="America/Chicago">
                      Central Time (CT)
                    </SelectItem>
                    <SelectItem value="America/New_York">
                      Eastern Time (ET)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Event Settings */}
              <div className="space-y-4">
                <Label>Event Settings</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-approve events</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve new events without manual review
                      </p>
                    </div>
                    <Switch
                      checked={businessSettings.auto_approve_events}
                      onCheckedChange={(checked) =>
                        setBusinessSettings({
                          ...businessSettings,
                          auto_approve_events: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Allow public events</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow your events to be discovered publicly
                      </p>
                    </div>
                    <Switch
                      checked={businessSettings.allow_public_events}
                      onCheckedChange={(checked) =>
                        setBusinessSettings({
                          ...businessSettings,
                          allow_public_events: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Promotion Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about promotions and special offers
                    </p>
                  </div>
                  <Switch
                    checked={notifications.notification_promotion_updates}
                    onCheckedChange={(checked) => {
                      console.log("Updating promotion updates:", checked);
                      setNotifications({
                        ...notifications,
                        notification_promotion_updates: checked,
                      });
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Customer Interactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when customers interact with your events
                    </p>
                  </div>
                  <Switch
                    checked={notifications.notification_customer_interactions}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        notification_customer_interactions: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing tips and platform updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.notification_marketing_updates}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        notification_marketing_updates: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Account Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important account and security notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.notification_account_alerts}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        notification_account_alerts: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveProfile}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
