import React, { useState } from "react";
import AgentManagement from "./AgentManagement";
import CsvUpload from "./CsvUpload";
import DistributedLists from "./DistributedLists";

interface AdminData {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface DashboardProps {
  admin: AdminData;
  onLogout: () => void;
}

const Dashboard = ({ admin, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("agents");

  const tabs = [
    { id: "agents", label: "Agent Management", icon: "👥" },
    { id: "upload", label: "CSV Upload", icon: "📁" },
    { id: "lists", label: "Distributed Lists", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {admin.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === "agents" && <AgentManagement adminId={admin.id} />}
        {activeTab === "upload" && <CsvUpload adminId={admin.id} />}
        {activeTab === "lists" && <DistributedLists />}
      </main>
    </div>
  );
};

export default Dashboard;
