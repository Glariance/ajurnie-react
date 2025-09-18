// AccountSidebar.jsx / .tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/api";

const fmt = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return isNaN(date) ? String(d) : date.toLocaleDateString();
};

const AccountSidebar = ({ mockData, user, subscription }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const baseClasses = "w-full block text-center py-2 px-4 rounded-lg transition-colors";
  const activeClasses = "bg-red-600 text-white";
  const inactiveClasses = "bg-gray-700 text-white hover:bg-gray-600";

  // Normalize some subscription fields just in case
  const start =
    subscription?.start_date ?? subscription?.startDate ?? subscription?.periodStart;
  const end =
    subscription?.current_period_end ?? subscription?.current_period_end ?? subscription?.periodEnd;
  const plan =
    subscription?.plan?.name ?? subscription?.plan ?? subscription?.product?.name ?? "—";
  const status = subscription?.status ?? "—";

  return (
    <div className="space-y-6">

      {/* Account Snapshot */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <div className="space-y-1 text-sm">
          <p><span className="text-gray-400">User:</span> {user?.fullname ?? "—"}</p>
          <p><span className="text-gray-400">Email:</span> {user?.email ?? "—"}</p>
        </div>
      </div>
      

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

          <NavLink
            to="/account/change-plan"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
            >
              Billing
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full block text-center py-2 px-4 rounded-lg bg-gray-700 text-white hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>


      {/* Subscription */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        {subscription ? (
          <div className="space-y-1 text-sm">
            <p><span className="text-gray-400">Plan:</span> {plan}</p>
            <p><span className="text-gray-400">Status:</span> {status}</p>
            <p><span className="text-gray-400">Start:</span> {fmt(start)}</p>
            <p><span className="text-gray-400">End:</span> {fmt(end)}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No active subscription.</p>
        )}
      </div>


      {/* Existing Upcoming Events (from mockData) */}
      {/* <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {(mockData?.subscription ?? []).slice(0, 2).map((s) => (
            <div key={s.id} className="p-3 bg-gray-700/50 rounded-lg">
              <p className="font-medium">{s.title}</p>
              <p className="text-sm text-gray-400">{s.date}</p>
            </div>
          ))}
        </div>
      </div> */}

    </div>

  );
};

export default AccountSidebar;
