import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import useSession from "../../hooks/useSession";
import { notify } from "../../lib/alerts";
import { Calendar, Target, TrendingUp, Award } from "lucide-react";
import { changePlan } from "../../api/api";
import api from "../../api/api"; // central API

export default function ChangePlan() {
  const stripe = useStripe();
  const elements = useElements();
  const { user, loading, token } = useSession();

  const [subscription, setSubscription] = useState<any>(null);
  const [form, setForm] = useState({
    plan: "novice",
    interval: "monthly",
    payment_method: "",
  });
  const [saving, setSaving] = useState(false);
  const [subLoading, setSubLoading] = useState(true);

  // founding cutoff check
  const isFounding = new Date() <= new Date("2025-12-31T23:59:59");

  // fetch subscription info
  useEffect(() => {
    if (user) {
      api
        .get("/api/subscription", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSubscription(res.data))
        .catch(() => setSubscription(null))
        .finally(() => setSubLoading(false));
    }
  }, [user, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();

    if (!stripe || !elements) {
      notify.error("Stripe has not loaded yet. Please try again.");
      return;
    }

    setSaving(true);

    try {
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement)!,
        });

      if (stripeError) {
        notify.error(stripeError.message || "Payment method failed.");
        setSaving(false);
        return;
      }

      await changePlan(
        {
          plan: form.plan,
          interval: form.interval,
          payment_method: paymentMethod.id,
        },
        { meta: { successMessage: "Your plan has been updated 🎉" } }
      );

      elements.getElement(CardElement)?.clear();
      // refresh subscription info after update
      const res = await api.get("/api/subscription", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscription(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || subLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400">
            Manage your subscription plan and billing preferences
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Same stats cards as before */}
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

        {/* Change Plan */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Change Plan</h2>

          {subscription && subscription.active ? (
            <p className="text-green-400">
               You are already enrolled in{" "}
              <span className="font-semibold">{subscription.plan}</span> (
              {subscription.price}). To change your plan, please cancel your
              current subscription first.
            </p>
          ) : (
            <form
              className="grid grid-cols-1 gap-4 w-full"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Plan Select */}
              <div>
                <label
                  htmlFor="plan"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Select Plan
                </label>
                <select
                  id="plan"
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:border-red-600 focus:ring-2 focus:ring-red-600/40"
                >
                  {isFounding ? (
                    <>
                      <option value="novice">
                        Novice Membership – $21.99/year (Founding Offer)
                      </option>
                      <option value="trainer">
                        Certified Trainer – $24.99/year (Founding Offer)
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="novice">Novice Membership</option>
                      <option value="trainer">Certified Trainer</option>
                    </>
                  )}
                </select>
              </div>

              {/* Interval (only for post-founding) */}
              {!isFounding && (
                <div>
                  <label
                    htmlFor="interval"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Billing Interval
                  </label>
                  <select
                    id="interval"
                    name="interval"
                    value={form.interval}
                    onChange={handleChange}
                    className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:border-red-600 focus:ring-2 focus:ring-red-600/40"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              {/* Stripe Card Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Details
                </label>
                <div className="p-3 bg-gray-900 border border-gray-700 rounded-lg">
                  <CardElement
                    options={{
                      style: { base: { color: "#fff", fontSize: "16px" } },
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Plan"}
              </button>

              {!user && (
                <p className="mt-3 text-xs text-yellow-400">
                  You appear to be logged out. Updating your plan will require
                  auth.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
