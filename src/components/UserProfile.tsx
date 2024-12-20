import { useState, useEffect } from "react";
import { useDataSync } from "../hooks/useDataSync";
import { UserProfile as UserProfileType } from "../types";
import { db } from "../services/database";
import { Edit2, Save, X } from "lucide-react";
import { notify } from "../utils/notifications";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { data, loading, error } = useDataSync<UserProfileType>("profiles", []);
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfileType | null>(
    null
  );
  const { user } = useAuth();

  useEffect(() => {
    if (data && data.length > 0) {
      const profileData = data[0];
      setProfile(profileData);
      setEditedProfile(profileData);
    }
  }, [data]);

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">Please sign in to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-red-500 flex flex-col items-center gap-4">
          <p>Error loading profile: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      if (!editedProfile || !user) return;

      const updatedProfile = {
        ...editedProfile,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      await db.updateUserProfile(updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      notify.success("Profile updated successfully");
    } catch (error) {
      notify.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (
    field: keyof UserProfileType,
    value: string | number
  ) => {
    if (!editedProfile) return;
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">
          No profile data available. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-200 text-gray-600 px-3 py-1 rounded hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={editedProfile?.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                value={editedProfile?.age || ""}
                onChange={(e) => handleChange("age", parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                value={editedProfile?.weight || ""}
                onChange={(e) =>
                  handleChange("weight", parseFloat(e.target.value))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                type="number"
                value={editedProfile?.height || ""}
                onChange={(e) =>
                  handleChange("height", parseInt(e.target.value))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="text-sm text-gray-500">Name</span>
              <p className="text-lg">{profile.name || "Not set"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Age</span>
              <p className="text-lg">{profile.age || "Not set"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Weight</span>
              <p className="text-lg">
                {profile.weight ? `${profile.weight} kg` : "Not set"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Height</span>
              <p className="text-lg">
                {profile.height ? `${profile.height} cm` : "Not set"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
