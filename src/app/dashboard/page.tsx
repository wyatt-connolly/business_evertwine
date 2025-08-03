"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BusinessDashboard from "@/components/BusinessDashboard";
import BusinessProfileSetup from "@/components/BusinessProfileSetup";
import { LoadingPage } from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const { user, businessProfile, isBusinessProfileComplete } = useAuth();
  const router = useRouter();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else if (businessProfile && !isBusinessProfileComplete()) {
      setShowSetup(true);
    }
  }, [user, businessProfile, isBusinessProfileComplete, router]);

  if (!user) {
    return <LoadingPage />;
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <BusinessProfileSetup
          onComplete={() => setShowSetup(false)}
          onBack={() => setShowSetup(false)}
        />
      </div>
    );
  }

  return <BusinessDashboard />;
}
