import React from "react";
import AccountSidebar from "../components/AccountSidebar";

type Props = {
  children: React.ReactNode;
  events: { id:number; title:string; date:string }[];
  onStartWorkout?: () => void;
  onViewProgress?: () => void;
  onUpdateGoals?: () => void;
};

export default function AccountLayout({
  children,
  events,
  onStartWorkout,
  onViewProgress,
  onUpdateGoals,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">{children}</div>
          <AccountSidebar
            events={events}
            onStartWorkout={onStartWorkout}
            onViewProgress={onViewProgress}
            onUpdateGoals={onUpdateGoals}
          />
        </div>
      </div>
    </div>
  );
}
