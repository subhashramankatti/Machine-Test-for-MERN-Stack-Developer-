import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster, toast } from "sonner";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

interface AdminData {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function App() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createDefaultAdmin = useMutation(api.adminAuth.createDefaultAdmin);

  useEffect(() => {
    // Create default admin on app start
    createDefaultAdmin().then(() => {
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    // Check for stored admin session
    const storedAdmin = localStorage.getItem("currentAdmin");
    if (storedAdmin) {
      setCurrentAdmin(JSON.parse(storedAdmin));
    }
  }, [createDefaultAdmin]);

  const handleLogin = (adminData: AdminData) => {
    setCurrentAdmin(adminData);
    localStorage.setItem("currentAdmin", JSON.stringify(adminData));
    toast.success("Login successful!");
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem("currentAdmin");
    toast.success("Logged out successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!currentAdmin ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard admin={currentAdmin} onLogout={handleLogout} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}
