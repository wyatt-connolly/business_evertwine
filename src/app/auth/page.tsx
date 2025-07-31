"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { LoadingPage } from "@/components/LoadingSpinner";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return <LoadingPage />;
  }

  return <LoginForm onToggleMode={toggleMode} isLogin={isLogin} />;
}
