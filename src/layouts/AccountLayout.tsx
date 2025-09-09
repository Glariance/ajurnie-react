// AccountLayout.jsx / .tsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AccountSidebar from "../components/AccountSidebar";
import api from "../api/api";
import useSession from "../hooks/useSession";

const mockData = {
  subscription: [
    { id: 1, title: "Fitness Workshop", date: "2024-12-15", attendees: 25 },
    { id: 2, title: "Nutrition Seminar", date: "2024-12-20", attendees: 18 },
  ],
};

export default function AccountLayout() {
  const { user, loading, token } = useSession();
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!user) return;
    api
      .get("/api/subscription", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubscription(res.data))
      .catch(() => setSubscription(null))
      .finally(() => {
        // If `loading` is a setter in your hook, keep this.
        // If `loading` is a boolean, remove this line.
        typeof loading === "function" && loading(false);
      });
  }, [user, token]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content (child routes) */}
          <div className="lg:col-span-3">
            {/* 👇 expose to child routes like /account/profile */}
            <Outlet context={{ user, subscription, token }} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar
              mockData={mockData}
              user={user}
              subscription={subscription}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
