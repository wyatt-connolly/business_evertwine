"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, MapPin, Mail, User, ArrowLeft } from "lucide-react";

interface BusinessProfileSetupProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export default function BusinessProfileSetup({
  onComplete,
  onBack,
}: BusinessProfileSetupProps) {
  const { businessProfile, updateBusinessProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: businessProfile?.business_name || "",
    contact_email: businessProfile?.contact_email || "",
    bio: businessProfile?.bio || "",
    address: businessProfile?.address || "",
    location: businessProfile?.location || {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    photo_url: businessProfile?.photo_url || "",
    business_settings: {
      timezone:
        businessProfile?.business_settings?.timezone || "America/Los_Angeles",
      auto_approve_events:
        businessProfile?.business_settings?.auto_approve_events ?? true,
      allow_public_events:
        businessProfile?.business_settings?.allow_public_events ?? true,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.business_name || !formData.contact_email) {
      alert("Please fill in the business name and contact email");
      return;
    }

    try {
      setLoading(true);
      await updateBusinessProfile(formData);

      // Small delay to ensure state is updated, then navigate
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 100);
    } catch (error) {
      console.error("Error updating business profile:", error);
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
    // When a location is selected from the dropdown
    setFormData((prev) => ({
      ...prev,
      address: location.display_name,
      location: {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
      },
    }));
  };

  const handleAddressChange = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between mb-2">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <div className="flex-1" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Building className="w-6 h-6 text-purple-600" />
          Complete Your Business Profile
        </CardTitle>
        <CardDescription>
          Set up your business information to start creating events
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="business_name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Business Name *
            </Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  business_name: e.target.value,
                }))
              }
              placeholder="Your Business Name"
              required
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contact_email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Business Contact Email *
            </Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact_email: e.target.value,
                }))
              }
              placeholder="contact@yourbusiness.com"
              required
            />
          </div>

          {/* Business Description */}
          <div className="space-y-2">
            <Label htmlFor="bio">Business Description</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Tell customers about your business..."
              rows={3}
            />
          </div>

          {/* Business Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Business Address
            </Label>
            <LocationAutocomplete
              id="address"
              value={formData.address}
              onChange={handleAddressChange}
              onLocationSelect={handleLocationSelect}
              placeholder="Search for your business address"
            />
          </div>

          {/* Business Logo Upload */}
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
                    // For now, we'll just set a placeholder URL
                    // In a real app, you'd upload to Firebase Storage
                    const fileUrl = URL.createObjectURL(file);
                    setFormData((prev) => ({ ...prev, photo_url: fileUrl }));
                  }
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {formData.photo_url && (
                <div className="w-16 h-16 border rounded-lg overflow-hidden">
                  <Image
                    src={formData.photo_url}
                    alt="Business logo preview"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formData.business_settings.timezone}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  business_settings: {
                    ...prev.business_settings,
                    timezone: value,
                  },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
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

          {/* Settings */}
          <div className="space-y-4">
            <Label>Event Settings</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.business_settings.auto_approve_events}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      business_settings: {
                        ...prev.business_settings,
                        auto_approve_events: e.target.checked,
                      },
                    }))
                  }
                />
                <span className="text-sm">Auto-approve new events</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.business_settings.allow_public_events}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      business_settings: {
                        ...prev.business_settings,
                        allow_public_events: e.target.checked,
                      },
                    }))
                  }
                />
                <span className="text-sm">Allow public event discovery</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onComplete}
              disabled={loading}
              className="flex-1"
            >
              Skip for now
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
