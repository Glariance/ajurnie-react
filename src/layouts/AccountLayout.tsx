import React from "react";
import { Outlet } from "react-router-dom";
import AccountSidebar from "../components/AccountSidebar";

// Mock data example (you can also fetch this dynamically)
const mockData = {
  events: [
    { id: 1, title: "Fitness Workshop", date: "2024-12-15", attendees: 25 },
    { id: 2, title: "Nutrition Seminar", date: "2024-12-20", attendees: 18 },
  ],
};

export default function AccountLayout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content: where child routes will render */}
          <div className="lg:col-span-3">
            <Outlet /> {/* 👈 This is where Dashboard/Profile/etc will appear */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar mockData={mockData} />
          </div>
        </div>
      </div>
    </div>
  );
}
