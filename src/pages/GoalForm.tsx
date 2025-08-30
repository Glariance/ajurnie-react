import React, { useState } from "react";
import { storeGoal } from "../api/api";
import useSession from "../hooks/useSession";

import {
  User,
  Target,
  Activity,
  Utensils,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function GoalForm() {
  const { user, logout } = useSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    height: "",
    currentWeight: "",
    fitnessGoal: "",
    targetWeight: "",
    deadline: "",
    activityLevel: "",
    workoutStyle: "",
    medicalConditions: "",
    dietaryPreferences: [],
    foodAllergies: "",
    user_id: user?.id || "",
  });

  const totalSteps = 3;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDietaryPreferenceChange = (preference: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter((p) => p !== preference)
        : [...prev.dietaryPreferences, preference],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await storeGoal({
        name: formData.name,
        email: formData.email,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseInt(formData.height) : null,
        current_weight: formData.currentWeight
          ? parseFloat(formData.currentWeight)
          : null,
        fitness_goal: formData.fitnessGoal,
        target_weight: formData.targetWeight
          ? parseFloat(formData.targetWeight)
          : null,
        deadline: formData.deadline || null,
        activity_level: formData.activityLevel,
        workout_style: formData.workoutStyle,
        medical_conditions: formData.medicalConditions || null,
        dietary_preferences: formData.dietaryPreferences,
        food_allergies: formData.foodAllergies || null,
        plan_generated: false,
        user_id: user?.id || null,
      });

      setIsSubmitted(true);

      setFormData({
        name: "",
        email: "",
        gender: "",
        age: "",
        height: "",
        currentWeight: "",
        fitnessGoal: "",
        targetWeight: "",
        deadline: "",
        activityLevel: "",
        workoutStyle: "",
        medicalConditions: "",
        dietaryPreferences: [],
        foodAllergies: "",
        user_id: user?.id || "",
      });
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err.response && err.response.status === 500) {
        if (err.response.data.message?.includes("Duplicate entry")) {
          setErrors({ email: ["The email has already been taken."] });
        } else {
          console.error("Server error:", err.response.data.message);
        }
      } else {
        console.error("Error submitting goal plan form:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-700">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">
                Your Plan is Ready!
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Thank you, {formData.name}! We've received your information and
                will create a personalized fitness and nutrition plan tailored
                specifically to your goals and preferences.
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-gray-800/30 rounded-xl p-6 mb-8 border border-red-800/30">
              <h2 className="text-xl font-semibold text-white mb-4">
                What's Next?
              </h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Your information has been saved securely
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Our experts will review your goals
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Custom plan will be sent to {formData.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    24/7 support access activated
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => (window.location.href = "/exercises")}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Browse Exercise Library
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full border-2 border-red-600 text-red-400 py-3 px-6 rounded-lg font-semibold hover:bg-red-900/30 transition-colors duration-200"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Get Your Personalized Plan {user ? `, ${user.fullname}` : ""}
          </h1>
          <p className="text-gray-400">
            Tell us about yourself and we'll create a custom fitness and
            nutrition plan
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-300">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700"
        >
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your full name"
                  />

                  <input
                    type="hidden"
                    name="user_id"
                    value={formData.user_id}
                  />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    name="gender"
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your age"
                    min="13"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    name="height"
                    required
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your height in cm"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="current_weight"
                    required
                    value={formData.currentWeight}
                    onChange={(e) =>
                      handleInputChange("currentWeight", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your current weight in kg"
                    min="30"
                    max="300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Medical Conditions or Injuries (Optional)
                </label>
                <textarea
                  value={formData.medicalConditions}
                  name="injuries"
                  onChange={(e) =>
                    handleInputChange("medicalConditions", e.target.value)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                  rows={3}
                  placeholder="Please mention any medical conditions, injuries, or physical limitations we should consider"
                />
              </div>
            </div>
          )}

          {/* Step 2: Fitness Goals */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Target className="h-6 w-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">
                  Fitness Goals
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Primary Fitness Goal *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      value: "lose_weight",
                      label: "Lose Weight",
                      desc: "Reduce body fat and overall weight",
                    },
                    {
                      value: "build_muscle",
                      label: "Build Muscle",
                      desc: "Increase muscle mass and strength",
                    },
                    {
                      value: "tone",
                      label: "Tone & Define",
                      desc: "Improve muscle definition and shape",
                    },
                    {
                      value: "maintain",
                      label: "Maintain Health",
                      desc: "Stay fit and healthy",
                    },
                  ].map((goal) => (
                    <label key={goal.value} className="relative">
                      <input
                        type="radio"
                        name="fitness_goal"
                        value={goal.value}
                        checked={formData.fitnessGoal === goal.value}
                        onChange={(e) =>
                          handleInputChange("fitnessGoal", e.target.value)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          formData.fitnessGoal === goal.value
                            ? "border-red-500 bg-red-900/30"
                            : "border-gray-600 hover:border-gray-500 bg-gray-700"
                        }`}
                      >
                        <div className="font-medium text-white">
                          {goal.label}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {goal.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="target_weight"
                    value={formData.targetWeight}
                    onChange={(e) =>
                      handleInputChange("targetWeight", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your target weight"
                    min="30"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    name="target_dealine"
                    value={formData.deadline}
                    onChange={(e) =>
                      handleInputChange("deadline", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Current Activity Level *
                </label>
                <div className="space-y-3">
                  {[
                    {
                      value: "sedentary",
                      label: "Sedentary",
                      desc: "Little to no exercise",
                    },
                    {
                      value: "lightly_active",
                      label: "Lightly Active",
                      desc: "Light exercise 1-3 days/week",
                    },
                    {
                      value: "moderately_active",
                      label: "Moderately Active",
                      desc: "Moderate exercise 3-5 days/week",
                    },
                    {
                      value: "very_active",
                      label: "Very Active",
                      desc: "Hard exercise 6-7 days/week",
                    },
                    {
                      value: "extremely_active",
                      label: "Extremely Active",
                      desc: "Very hard exercise, physical job",
                    },
                  ].map((level) => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        name="activity_level"
                        value={level.value}
                        checked={formData.activityLevel === level.value}
                        onChange={(e) =>
                          handleInputChange("activityLevel", e.target.value)
                        }
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-700"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-white">
                          {level.label}
                        </div>
                        <div className="text-sm text-gray-400">
                          {level.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Workout Style Preference *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      value: "gym",
                      label: "Gym Workouts",
                      desc: "Access to gym equipment",
                    },
                    {
                      value: "home",
                      label: "Home Workouts",
                      desc: "Bodyweight & minimal equipment",
                    },
                    {
                      value: "both",
                      label: "Both",
                      desc: "Mix of gym and home workouts",
                    },
                  ].map((style) => (
                    <label key={style.value} className="relative">
                      <input
                        type="radio"
                        name="workout_style"
                        value={style.value}
                        checked={formData.workoutStyle === style.value}
                        onChange={(e) =>
                          handleInputChange("workoutStyle", e.target.value)
                        }
                        className="sr-only"
                      />
                      <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center ${
                          formData.workoutStyle === style.value
                            ? "border-red-500 bg-red-900/30"
                            : "border-gray-600 hover:border-gray-500 bg-gray-700"
                        }`}
                      >
                        <div className="font-medium text-white">
                          {style.label}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {style.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Step 3: Dietary Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Utensils className="h-6 w-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">
                  Dietary Information
                </h2>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Dietary Preferences (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Vegetarian",
                    "Vegan",
                    "Keto",
                    "Low-Carb",
                    "Mediterranean",
                    "Paleo",
                    "Gluten-Free",
                    "Dairy-Free",
                    "No Restrictions",
                  ].map((preference) => (
                    <label key={preference} className="flex items-center">
                      <input
                        type="checkbox"
                        name="dietary_preferences[]"
                        checked={formData.dietaryPreferences.includes(
                          preference
                        )}
                        onChange={() =>
                          handleDietaryPreferenceChange(preference)
                        }
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-700 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-300">
                        {preference}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Food Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Food Allergies or Intolerances
                </label>
                <textarea
                  value={formData.foodAllergies}
                  name="food_allergies"
                  onChange={(e) =>
                    handleInputChange("foodAllergies", e.target.value)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                  rows={3}
                  placeholder="Please list any food allergies, intolerances, or foods you avoid"
                />
              </div>

              {/* Review Section */}
              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                <h3 className="font-medium text-red-400 mb-3">
                  Review Your Information
                </h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>
                    <strong>Name:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Gender:</strong> {formData.gender}
                  </p>
                  <p>
                    <strong>Age:</strong> {formData.age}
                  </p>
                  <p>
                    <strong>Height:</strong> {formData.height} cm
                  </p>
                  <p>
                    <strong>Current Weight:</strong> {formData.currentWeight} kg
                  </p>
                  <p>
                    <strong>Goal:</strong>{" "}
                    {formData.fitnessGoal
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                  <p>
                    <strong>Target Weight:</strong> {formData.targetWeight} kg
                  </p>
                  <p>
                    <strong>Deadline:</strong> {formData.deadline}
                  </p>
                  <p>
                    <strong>Activity Level:</strong>{" "}
                    {formData.activityLevel
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                  <p>
                    <strong>Workout Style:</strong>{" "}
                    {formData.workoutStyle.charAt(0).toUpperCase() +
                      formData.workoutStyle.slice(1)}
                  </p>
                  <p>
                    <strong>Medical Conditions:</strong>{" "}
                    {formData.medicalConditions || "None"}
                  </p>
                  <p>
                    <strong>Dietary Preferences:</strong>{" "}
                    {formData.dietaryPreferences.length > 0
                      ? formData.dietaryPreferences.join(", ")
                      : "None"}
                  </p>
                  <p>
                    <strong>Food Allergies:</strong>{" "}
                    {formData.foodAllergies || "None"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Errors Display */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">
                Please fix the following errors:
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(errors).map(([field, messages]) => (
                  <li key={field}>{messages[0]}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
            {/* Previous Button */}
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentStep === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Previous
            </button>

            {/* Next Step or Submit */}
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); // stop form submission
                  nextStep(); // go to next step
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium hover:bg-green-700 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Create My Plan"}
                <CheckCircle className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
