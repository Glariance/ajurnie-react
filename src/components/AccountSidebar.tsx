import React from "react";

type Event = { id: number; title: string; date: string };
type Props = {
  events: Event[];
  onStartWorkout?: () => void;
  onViewProgress?: () => void;
  onUpdateGoals?: () => void;
};

export default function AccountSidebar({
  events,
  onStartWorkout,
  onViewProgress,
  onUpdateGoals,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <button
            onClick={onStartWorkout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Start Workout
          </button>
          <button
            onClick={onViewProgress}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            View Progress
          </button>
          <button
            onClick={onUpdateGoals}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Update Goals
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {events.slice(0, 2).map((event) => (
            <div key={event.id} className="p-3 bg-gray-700/50 rounded-lg">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-400">{event.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
