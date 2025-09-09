import React, { useState, useEffect } from "react";
import api from "../../api/api"; // ✅ centralized API instance
import useSession from "../../hooks/useSession";
import { Target, TrendingUp, Calendar, Award } from "lucide-react";

export default function Dashboard() {
  const { user, loading, token } = useSession();
  const [subscription, setSubscription] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Fetch subscription using your API instance
  useEffect(() => {
    if (user) {
      api
        .get("/api/subscription", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setSubscription(res.data);
        })
        .catch(() => {
          setSubscription(null);
        })
        .finally(() => loading(false));
    }
  }, [user]);

  // ✅ Cancel subscription
  const cancelSubscription = () => {
    api
      .post(
        "/api/subscription/cancel",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setSubscription({ ...subscription, status: "canceled" });
        setShowConfirm(false);
      })
      .catch((err) => {
        console.error("Cancel failed:", err);
        setShowConfirm(false);
      });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.fullname}!
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your fitness journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-900/30 rounded-lg">
              <Target className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Active Goals</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Progress</p>
              <p className="text-2xl font-bold">75%</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Workouts</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-900/30 rounded-lg">
              <Award className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Streak</p>
              <p className="text-2xl font-bold">7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">My Subscription</h2>

        {loading ? (
          <p className="text-gray-400">Loading subscription...</p>
        ) : subscription && subscription.active ? (
          <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-700">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">Current Period End</th>
                  {/* <th className="px-4 py-3">Cancel At</th> */}
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-900 border-t border-gray-700">
                  <td className="px-4 py-3">{subscription.plan}</td>
                  <td className="px-4 py-3">{subscription.price}</td>
                  <td className="px-4 py-3 capitalize">
                    {subscription.status}
                  </td>
                  <td className="px-4 py-3">{subscription.start_date}</td>
                  <td className="px-4 py-3">
                    {subscription.current_period_end}
                  </td>
                  {/* <td className="px-4 py-3">
                    {subscription.cancel_at || "-"}
                  </td> */}
                  <td className="px-4 py-3 text-center">
                    {subscription.status !== "canceled" ? (
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-gray-400">Cancelled</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No active subscription</p>
        )}
      </div>

      {/* Cancel Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to cancel your subscription?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                No, Keep It
              </button>
              <button
                onClick={cancelSubscription}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
