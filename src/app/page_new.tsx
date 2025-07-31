"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Business Evertwine
          </h1>
          <p className="text-gray-600">Welcome to your business platform</p>
        </div>
        <LoginForm onToggleMode={toggleMode} isLogin={isLogin} />
      </div>
    </div>
  );
}
