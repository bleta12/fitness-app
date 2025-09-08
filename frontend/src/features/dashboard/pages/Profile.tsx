import React, { useState } from "react";
import Navbar from "@/components/Navbar";

type ProfileForm = {
  name: string;
  email: string;
  age: number | string;
  currentWeight: number | string;
  heightFeet: number | string;
  heightInches: number | string;
  targetWeight: number | string;
  fitnessGoal: "Weight Loss" | "Muscle Gain" | "Maintenance";
  activityLevel: "Beginner" | "Intermediate" | "Advanced";
};

export default function Profile() {
  const [formData, setFormData] = useState<ProfileForm>({
    name: "rreze morina",
    email: "rreze@example.com",
    age: 25,
    currentWeight: 150,
    heightFeet: 8,
    heightInches: 15,
    targetWeight: 145,
    fitnessGoal: "Weight Loss",
    activityLevel: "Beginner",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile:", formData);
    // TODO: connect to backend
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8 gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-64">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col space-y-8 pb-20 md:pb-0">
        {/* Page header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
            <p className="text-gray-500 mt-1">Manage your account details</p>
          </div>
        </header>

        {/* Profile card/form */}
        <div className="mx-auto w-full max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Header: avatar + name + email + member badge */}
          <div className="mb-6 flex flex-col sm:flex-row items-center sm:items-start rounded-xl bg-slate-50 p-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-600 text-2xl font-semibold text-white">
              {formData.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3 text-center sm:text-left leading-snug">
              <div className="text-base font-semibold text-slate-900">
                {formData.name}
              </div>
              <div className="text-sm text-slate-500">{formData.email}</div>
              <div className="text-xs font-medium text-emerald-600">
                FitAI Member
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row: Age + Current Weight */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-600">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className="w-full rounded-full border border-slate-200 bg-slate-100 px-4 py-2 outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">
                  Current Weight (lbs)
                </label>
                <input
                  type="number"
                  name="currentWeight"
                  value={formData.currentWeight}
                  onChange={handleChange}
                  placeholder="Current Weight (lbs)"
                  className="w-full rounded-full border border-slate-200 bg-slate-100 px-4 py-2 outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Row: Height (feet + inches) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-600">
                  Height (feet)
                </label>
                <input
                  type="number"
                  name="heightFeet"
                  value={formData.heightFeet}
                  onChange={handleChange}
                  placeholder="Height (feet)"
                  className="w-full rounded-full border border-slate-200 bg-slate-100 px-4 py-2 outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">
                  Height (inches)
                </label>
                <input
                  type="number"
                  name="heightInches"
                  value={formData.heightInches}
                  onChange={handleChange}
                  placeholder="Height (inches)"
                  className="w-full rounded-full border border-slate-200 bg-slate-100 px-4 py-2 outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Target weight */}
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Target Weight (lbs)
              </label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                placeholder="Target Weight (lbs)"
                className="w-full rounded-full border border-slate-200 bg-slate-100 px-4 py-2 outline-none focus:border-emerald-400"
              />
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Fitness Goal
              </label>
              <div className="relative">
                <select
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-full border border-slate-200 bg-slate-100 px-4 py-2 pr-10 outline-none focus:border-emerald-400"
                >
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                  <option>Maintenance</option>
                </select>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Activity Level
              </label>
              <div className="relative">
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-full border border-slate-200 bg-slate-100 px-4 py-2 pr-10 outline-none focus:border-emerald-400"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            {/* Buttons: Save + Cancel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="submit"
                className="col-span-1 rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="col-span-1 rounded-full border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


