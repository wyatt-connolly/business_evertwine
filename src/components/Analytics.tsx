"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/firebase";

export default function Analytics() {
  useEffect(() => {
    // Analytics will be initialized automatically when this component mounts on the client
    if (analytics) {
      console.log("Firebase Analytics initialized");
    }
  }, []);

  return null; // This component doesn't render anything
}
