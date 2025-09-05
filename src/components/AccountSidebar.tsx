import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/api";


const AccountSidebar = ({ mockData }) => {
  
  const navigate = useNavigate();

  // ✅ Call API logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  // ✅ Reusable styles
  const baseClasses =
    "w-full block text-center py-2 px-4 rounded-lg transition-colors";
  const activeClasses = "bg-red-600 text-white";
  const inactiveClasses = "bg-gray-700 text-white hover:bg-gray-600";

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <NavLink
            to="/account/dashboard"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/account/profile"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/account/change-password"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Change Password
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full block text-center py-2 px-4 rounded-lg bg-gray-700 text-white hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {mockData.events.slice(0, 2).map((event) => (
            <div key={event.id} className="p-3 bg-gray-700/50 rounded-lg">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-400">{event.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;
